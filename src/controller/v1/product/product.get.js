const { response, resMessage } = require("../../../helpers/common");
const { Product } = require("../../../models/product.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Product,
});

// Retrieve and return all products from the database.
exports.findAll = async (req) => {
	try {
		let meta = {};
		const pageNumber = parseInt(req.query.pageNumber);
		const pageSize = 10;
		const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
		const sortCriteria = { _id: -1 };
		let productsList, productCount;
		if(req.isVendor){
			productsList =
				await makeMongoDbService.getDocumentByCustomAggregation([
					{ $match: { vendor: req.vendor._id, status: { $ne: "D" } } },
					{
						$project: {
							title: 1,
							subTitle: 1,
							author: 1,
							description: 1,
							price: 1,
							offer_price: 1,
							image: 1,
							category: 1,
							status: 1,
							isSoldOut: 1,
							vendor: 1,
							extraAttr: 1,
						},
					},
					{ $sort: sortCriteria },
					{ $skip: skip },
					{ $limit: pageSize },
				]);
			productCount = await makeMongoDbService.getCountDocumentByQuery({ vendor: req.vendor._id, status: { $ne: "D" } });
		}else{
			productsList =
				await makeMongoDbService.getDocumentByCustomAggregation([
					{ $match: { status: { $ne: "D" } } },
					{
						$project: {
							title: 1,
							subTitle: 1,
							author: 1,
							description: 1,
							price: 1,
							offer_price: 1,
							image: 1,
							category: 1,
							status: 1,
							vendor: 1,
							isSoldOut: 1,
							extraAttr: 1,
						},
					},
					{ $sort: sortCriteria },
					{ $skip: skip },
					{ $limit: pageSize },
				]);
			productCount = await makeMongoDbService.getCountDocumentByQuery({ status: { $ne: "D" } });
		}
		meta = {
			pageNumber,
			pageSize,
			totalCount: productCount,
			prevPage: parseInt(pageNumber) === 1 ? false : true,
			nextPage:
				parseInt(productCount) / parseInt(pageSize) <= parseInt(pageNumber)
				? false
				: true,
			totalPages: Math.ceil(parseInt(productCount) / parseInt(pageSize)),
		};
		return response(false, null, resMessage.success, {
			result: productsList,
			meta 
		});
	} catch (error) {
		return response(true, null, error.message, error.stack);
	}
};

exports.findById = async (req) => {
	try {
		let isProduct;
		if(req.isVendor){
			isProduct = await makeMongoDbService.getSingleDocumentByQuery({ 
				vendor: req.vendor._id, _id: req.query.product_id
			});
		}else{
			isProduct = await makeMongoDbService.getSingleDocumentById(
				req.query.product_id
			);
		}
		if (!isProduct || isProduct.status == "D") {
			return response(true, null, resMessage.notFound);
		}
		return response(false, null, resMessage.success, isProduct);
	} catch (error) {
		return response(true, null, error.message, error.stack);
	}
};
