const { Order } = require("../../../models/order.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Order,
});
const { Product } = require("../../../models/product.model");
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
	model: Product,
});
const { response, resMessage } = require("../../../helpers/common");
const { default: mongoose } = require("mongoose");

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
                { user_id: req.user ? req.user._id :req.vendor._id },
                { status: { $ne: 'D' } }
            ]
        };

        if (searchValue && searchValue.trim() !== "") {
			matchCondition['$and'].push({
                $or: [
                    { user_id: { $regex: searchValue, $options: "i" } },
                    { cart_id: { $regex: searchValue, $options: "i" } },
                    { status: { $regex: searchValue, $options: "i" } },
                ],
            });
		}

        let products = await makeMongoDbServiceProduct.getDocumentByQuery({
			status: { $ne: 'D'}
		});
		products = products.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

		if(req.user && req.user.isAdmin === true){
            if(req.query.order_id && req.query.order_id !== ''){
                matchCondition = {
                    $and: [
                        { _id: new mongoose.Types.ObjectId(req.query.order_id)},
                        { status: { $ne: 'D' } }
                    ],
                    $or: [
                        { title: { $regex: searchValue, $options: "i" } },
                        { sub_title: { $regex: searchValue, $options: "i" } },
                        { author: { $regex: searchValue, $options: "i" } },
                        { description: { $regex: searchValue, $options: "i" } },
                        { category: { $regex: searchValue, $options: "i" } },
                    ],
                }
            }else { 
                matchCondition = { 
                    $and: [
                        {status: { $ne: 'D' } },
                    ],
                    $or: [
                        { title: { $regex: searchValue, $options: "i" } },
                        { sub_title: { $regex: searchValue, $options: "i" } },
                        { author: { $regex: searchValue, $options: "i" } },
                        { description: { $regex: searchValue, $options: "i" } },
                        { category: { $regex: searchValue, $options: "i" } },
                    ],
                }
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
                matchCondition = {
                    $and: [
                        { _id: new mongoose.Types.ObjectId(req.query.order_id) },
                        { vendors: { $in: [req.vendor._id] } },
                        { status: { $ne: 'D' } }
                    ]
                }
            } else { 
                matchCondition = {
                    $and: [
                        { vendors: { $in: [req.vendor._id] } },
                        { status: { $ne: 'D' } }
                    ]
                } 
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
                    status: { $ne: 'D' } 
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
                return {
                    ...product,
                    productDetails: (!productDetails) ? {} : productDetails
                }
            });
            return filteredOrder     
        })
        
        return response(false, null, resMessage.success, {
            result,
            meta,
            usesDetails : req.user
        });
	} catch (error) {
        throw response(true, null, error.message, error.stack);
	}
};

exports.update = async (req) => {
    try {
    
        let isorder = await makeMongoDbService.getDocumentById(req.body.order_id);
    
        if (!isorder) {
          return response(true, resMessage.orderNotFound, null);
        }
        const orderData = req.body; 
        const updatedOrder = await makeMongoDbService.findOneAndUpdateDocument(
          { _id: req.body.order_id },
          orderData
        );
    
        return response(false, resMessage.userUpdated, null, updatedOrder);
        } catch (error) {
        throw response(true, null, error.message, error.stack);
    }
}

exports.delete = async (req) => {
    try {
    
        let isorder = await makeMongoDbService.getDocumentById(req.body.order_id);
    
        if (!isorder) {
          return response(true, resMessage.orderNotFound, null);
        }
        const updatedOrder = await makeMongoDbService.findOneAndUpdateDocument(
          { _id: req.body.order_id },
          {status: 'D'}
        );
    
        return response(false, "Order Delete Successfully", null, updatedOrder);
        } catch (error) {
        throw response(true, null, error.message, error.stack);
    }
}