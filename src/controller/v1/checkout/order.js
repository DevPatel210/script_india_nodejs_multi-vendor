const { Order } = require("../../../models/order.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Order,
});
const { response, resMessage } = require("../../../helpers/common");
const { default: mongoose } = require("mongoose");

exports.get = async (req) => {
	try {
        let meta = {};
        const pageNumber = parseInt(req.query.pageNumber);
        const pageSize = 10;
        const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
        const sortCriteria = { _id: -1 };
        let orderCount = 0;
        let result = {};
        let matchCondition = { 
            $and: [
                { user_id: req.user._id },
                { status: { $ne: 'D' } }
            ]
        };

		if(req.user && req.user.isAdmin === true){
            if(req.query.order_id && req.query.order_id !== ''){
                matchCondition = {
                    _id: new mongoose.Types.ObjectId(req.query.order_id)
                }
            }else { matchCondition = {} }
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
                const filteredProducts = order.accounting.cartAccountingList.filter((product) => product.vendorId==req.vendor._id);
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