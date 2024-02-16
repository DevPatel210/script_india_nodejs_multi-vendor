const { response, resMessage } = require("../../../helpers/common");
const { Category } = require("../../../models/category.model");
const { Product } = require("../../../models/product.model");
const Review = require("../../../models/review.model");
const makeMongoDbService = require("../../../services/mongoDbService")({
	model: Category,
});
const makeMongoDbServiceProduct = require("../../../services/mongoDbService")({
	model: Product,
});
const makeMongoDbServiceReview = require("../../../services/mongoDbService")({
	model: Review,
});

// Retrieve and return all products from the database.
exports.findAll = async (req) => {
	try {
		let meta = {};
		const pageNumber = parseInt(req.query.pageNumber);
		if (isNaN(pageNumber) || pageNumber < 1) {
			throw new Error('Invalid pageNumber');
		}
		const pageSize = 10;
		const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
		const sortCriteria = { _id: -1 };
		const searchValue = req.query.search;
		// let vendors = await makeMongoDbServiceVendor.getDocumentByQuery({
		// 	status: { $ne: 'D'}
		// });
		// vendors = vendors.reduce((obj, item) => (obj[item._id] = item, obj) ,{});

		let matchCondition = {
			$and: [{ status: { $ne: "D" } }]
		 };
		if (searchValue && searchValue.trim() !== "") {
			matchCondition.$and.push({
					$or: [
						{ name: { $regex: searchValue, $options: "i" } },
					],
				},
			)
		}

		let categoryList, categoryCount;
		categoryList =
			await makeMongoDbService.getDocumentByCustomAggregation([
				{ $match: matchCondition },
				{ $sort: sortCriteria },
				{ $skip: skip },
				{ $limit: pageSize },
			]);
		categoryCount = await makeMongoDbService.getCountDocumentByQuery(matchCondition);

		meta = {
			pageNumber,
			pageSize,
			totalCount: categoryCount,
			prevPage: parseInt(pageNumber) === 1 ? false : true,
			nextPage:
				parseInt(categoryCount) / parseInt(pageSize) <= parseInt(pageNumber)
				? false
				: true,
			totalPages: Math.ceil(parseInt(categoryCount) / parseInt(pageSize)),
		};
		return response(false, null, resMessage.success, {
			result: categoryList,
			meta 
		},200);
	} catch (error) {
		return response(true, null, error.message, error.stack,500);
	}
};

exports.findById = async (req) => {
	try {
		let isCategory;
		isCategory = await makeMongoDbService.getSingleDocumentById(
			req.query.product_id
		);
		if (!isCategory || isCategory.status == "D") {
			return response(true, null, resMessage.notFound,[],404);
		}
		
		let reviews = await makeMongoDbServiceReview.getDocumentByQueryPopulate({
			status: { $ne: 'D' }
		},null,["user"]);

		let matchCondition = { 
			$and: [
				{ category: isCategory._id.toString() },
				{ status: { $ne: "D" } }
			]
		}

		if (req.isVendor) {
			matchCondition.$and.push({
				vendor: req.vendor._id
			})
		}

		const productsList = await makeMongoDbServiceProduct.getDocumentByQuery({
			$match: matchCondition
		});

		isCategory = {
			...isCategory._doc,
			productsList
		}
		return response(false, null, resMessage.success, isCategory,200);
	} catch (error) {
		return response(true, null, error.message, error.stack,500);
	}
};
