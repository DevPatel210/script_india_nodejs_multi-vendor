const { Order } = require("../../../models/order.model");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Order,
});
const makeMongoDbServiceUser = require("../../../services/mongoDbService")({
	model: User,
});
const { Product } = require("../../../models/product.model");
const { Vendor } = require("../../../models/vendor.model");
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
	model: Product,
});
const makeMongoDbServiceVendor = require("../../../services/mongoDbService")({
	model: Vendor,
});
const { response, resMessage } = require("../../../helpers/common");
const { default: mongoose } = require("mongoose");
const { sendEmail } = require("../../../services/email");

exports.get = async (req) => {
	try {
        let meta = {};
        const pageNumber = parseInt(req.query.pageNumber);
        if (isNaN(pageNumber) || pageNumber < 1) {
			throw new Error('Invalid pageNumber');
		}
        const pageSize = 10;
        const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
        const sortCriteria = { _id: -1 };
        const searchValue = req.query.search || '';
        let orderCount = 0;
        let result = {};
        let matchCondition = { 
            $and: [
                { status: { $ne: 'D' } }
            ]
        };

        if (searchValue && searchValue.trim() !== "") {
			matchCondition['$and'].push({
                $or: [
                    { payment_status: { $regex: searchValue, $options: "i" } },
                    { status: { $regex: searchValue, $options: "i" } },
                    { vendorNames: { $regex: searchValue, $options: "i" } },
                    // { vendors: { $regex: searchValue, $options:"i" } },
                ],
            });
		}

        let products = await makeMongoDbServiceProduct.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		products = products.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

        let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		vendors = vendors.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

		if(req.user && req.user.isAdmin === true){
            if(req.query.order_id && req.query.order_id !== ''){
                matchCondition['$and'].push({ 
                    _id: new mongoose.Types.ObjectId(req.query.order_id)
                })
            }
            result = await makeMongoDbService.getDocumentByCustomAggregation([
                { $match: matchCondition},
                { $sort: sortCriteria },
                { $skip: skip },
                { $limit: pageSize },
            ]);
            orderCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

            meta = {
                pageNumber,
                pageSize,
                totalCount: orderCount,
                prevPage: parseInt(pageNumber) === 1 ? false : true,
                nextPage:
                parseInt(orderCount) / parseInt(pageSize) <= parseInt(pageNumber)
                    ? false
                    : true,
                totalPages: Math.ceil(parseInt(orderCount) / parseInt(pageSize)),
            };
        }else if(req.isVendor === true){
            if(req.query.order_id && req.query.order_id !== ''){
                matchCondition['$and'].push({
                    _id: new mongoose.Types.ObjectId(req.query.order_id)
                },{
                    vendors: { $in: [req.vendor._id] }
                })
            } else {
                matchCondition['$and'].push({
                    vendors: { $in: [req.vendor._id] }
                });
            }
            result = await makeMongoDbService.getDocumentByCustomAggregation([
                { $match: matchCondition},
                { $sort: sortCriteria },
                { $skip: skip },
                { $limit: pageSize },
            ]);
            orderCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);
            
            result = result.map((order) => {
                const filteredOrder = {...order};
                const filteredProducts = order.accounting.cartAccountingList.filter((product) => product.vendorId.toString()==req.vendor._id);
                let totalPrice = 0;
                for(let product of filteredProducts){
                    totalPrice += product.totalPrice;
                }

                filteredOrder.accounting.cartAccountingList = filteredProducts;
                filteredOrder.vendorNames = filteredOrder.vendorNames ? (filteredOrder.vendorNames.map((name)=> {
                    let arr = name.split(' ');
                    arr = arr.slice(0,arr.length-1);
                    return arr.join(' ');
                })) : [];
                filteredOrder.accounting.finalTotal = totalPrice;
                return filteredOrder     
            })
            meta = {
                pageNumber,
                pageSize,
                totalCount: orderCount,
                prevPage: parseInt(pageNumber) === 1 ? false : true,
                nextPage:
                parseInt(orderCount) / parseInt(pageSize) <= parseInt(pageNumber)
                    ? false
                    : true,
                totalPages: Math.ceil(parseInt(orderCount) / parseInt(pageSize)),
            };
        }else{    
            if(req.query.order_id && req.query.order_id !== ''){
                matchCondition['$and'].push({
                    _id: new mongoose.Types.ObjectId(req.query.order_id),
                },{
                    user_id: req.user ? req.user._id :req.vendor._id
                })
            }else{
                matchCondition['$and'].push({
                    user_id: req.user ? req.user._id :req.vendor._id
                })
            }
            result = await makeMongoDbService.getDocumentByCustomAggregation([
                {
                    $match: matchCondition
                },
                { $sort: sortCriteria },
                { $skip: skip },
                { $limit: pageSize },
            ]);
            orderCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

            meta = {
                pageNumber,
                pageSize,
                totalCount: orderCount,
                prevPage: parseInt(pageNumber) === 1 ? false : true,
                nextPage:
                parseInt(orderCount) / parseInt(pageSize) <= parseInt(pageNumber)
                    ? false
                    : true,
                totalPages: Math.ceil(parseInt(orderCount) / parseInt(pageSize)),
            };
        }

        result = result.map((order) => {
            const filteredOrder = {...order};
            filteredOrder.accounting.cartAccountingList = order.accounting.cartAccountingList.map((product)=>{
                // console.log(product);
                const productDetails = products[product.productId.toString()]
                const vendorDetails = vendors[product.vendorId.toString()]
                return {
                    ...product,
                    productDetails: (!productDetails) ? {} : productDetails,
                    vendorDetails: (!vendorDetails) ? {} : vendorDetails
                }
            });
            return filteredOrder     
        })
        
        return response(false, null, resMessage.success, {
            result,
            meta,
            usesDetails : req.user
        },200);
	} catch (error) {
        throw response(true, null, error.message, error.stack,500);
	}
};

exports.getByDate = async (req) => {
	try {
        let meta = {};
        const startDateParts = req.query.startDate.split("-");
        const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0], 18, 30, 0, 0);

        const endDateParts = req.query.endDate.split("-");
        const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0], 18, 30, 0, 0);

        let orderCount = 0;
        let result = [];
        let matchCondition = { 
            $and: [
                { 
                    status: 'C'
                },
                { 
                    createdAt: {
					    $gte: startDate,
					    $lte: endDate
				    }  
                }
            ]
        };

        let products = await makeMongoDbServiceProduct.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		products = products.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

        let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		vendors = vendors.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

		// if(req.user && req.user.isAdmin === true){
            result = await makeMongoDbService.getDocumentByCustomAggregation([
                { $match: matchCondition},
            ]);
            orderCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

            meta = {
                totalCount: orderCount,
            };
        // }

        result = result.map((order) => {
            const filteredOrder = {...order};
            filteredOrder.vendorNames = filteredOrder.vendorNames ? (filteredOrder.vendorNames.map((name)=> {
                let arr = name.split(' ');
                arr = arr.slice(0,arr.length-1);
                return arr.join(' ');
            })) : [];
            filteredOrder.accounting.cartAccountingList = order.accounting.cartAccountingList.map((product)=>{
                // console.log(product);
                const productDetails = products[product.productId.toString()]
                const vendorDetails = vendors[product.vendorId.toString()]
                return {
                    ...product,
                    productDetails: (!productDetails) ? {} : productDetails,
                    vendorDetails: (!vendorDetails) ? {} : vendorDetails
                }
            });
            console.log(filteredOrder);
            return filteredOrder     
        })
        
        return response(false, null, resMessage.success, {
            meta,
            result,
        },200);
	} catch (error) {
        console.log(error);
        throw response(true, null, error.message, error.stack,500);
	}
};

exports.update = async (req) => {
    try {
        let isorder = await makeMongoDbService.getDocumentById(req.body.order_id);
    
        if (!isorder) {
          return response(true, resMessage.orderNotFound, null,[],404);
        }
        const orderData = req.body; 
        const updatedOrder = await makeMongoDbService.findOneAndUpdateDocument(
          { _id: req.body.order_id },
          orderData
        );
    
        return response(false, resMessage.orderUpdated, null, updatedOrder,200);
        } catch (error) {
        throw response(true, null, error.message, error.stack,500);
    }
}

exports.delete = async (req) => {
    try {
        let isorder = await makeMongoDbService.getDocumentById(req.body.order_id);
        if (!isorder) {
          return response(true, resMessage.orderNotFound, null,[],404);
        }
        const updatedOrder = await makeMongoDbService.findOneAndUpdateDocument(
          { _id: req.body.order_id },
          {status: 'D'}
        );
    
        return response(false, "Order Delete Successfully", null, updatedOrder,200);
        } catch (error) {
        throw response(true, null, error.message, error.stack,500);
    }
}

exports.addTrackingDetails = async (req) => {
    try {
        if(req.isVendor){
            let isorder = await makeMongoDbService.getDocumentById(req.body.order_id);
            if (!isorder) {
                return response(true, resMessage.orderNotFound, null,[],404);
            }
            if (!isorder.vendors.map((id)=>id.toString()).includes(req.vendor._id.toString())) {
                return response(true, null, resMessage.failed,[],403);
            }
            
            const order = isorder;
            order.status = 'S';
            order.trackingDetails = {
                tracking_number: req.body.tracking_number,
                tracking_link: req.body.tracking_link,
                remarks: req.body.remarks,
                carrier: req.body.carrier,
                delivery_date: req.body.delivery_date
            }
            const updatedOrder = await makeMongoDbService.findOneAndUpdateDocument(
              { _id: req.body.order_id },
              order
            );

            const user = await makeMongoDbServiceUser.getDocumentById(order.user_id);
            const message = getAddShippingMessage(order);
            await sendEmail(user.email,'Order is shipped', message);
        
            return response(false, resMessage.orderUpdated, null, updatedOrder,200);
        }
        return response(true, null, resMessage.failed,[],403);
    } catch (error) {
        return response(true, null, error.message, error.stack,500);
    }
}

function getAddShippingMessage(order){
	return `
		Dear customer,<br>
		Your order is placed for shipping. Please find the shipping details of your order below: 
        <br>
		<h4>Order id:</h4> ${order._id.toString()}
		<h4>Shipping Address:</h4> ${order.shippingAddress}
		<h4>Billing Address:</h4> ${order.billingAddress}
		<h4>Final Price:</h4> $ ${order.accounting.finalTotal}
		<h4>Tracking Number:</h4> ${order.trackingDetails.tracking_number}
		<h4>Tracking Link:</h4> ${order.trackingDetails.tracking_link}
		<h4>Remarks:</h4> ${order.trackingDetails.remarks}
		<h4>Tracking carrier:</h4> ${order.trackingDetails.carrier}
		<h4>Delivery Date:</h4> ${order.trackingDetails.delivery_date}
	`
}