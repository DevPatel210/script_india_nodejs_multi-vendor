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
		let meta = {};
		const pageNumber = parseInt(req.query.pageNumber);
		if (isNaN(pageNumber) || pageNumber < 1) {
			throw new Error('Invalid pageNumber');
		}
		let isCategory;
		isCategory = await makeMongoDbService.getSingleDocumentById(
			req.query.category_id
		);
		if (!isCategory || isCategory.status == "D") {
			return response(true, null, resMessage.notFound,[],404);
		}
		
		let reviews = await makeMongoDbServiceReview.getDocumentByQueryPopulate({
			status: { $ne: 'D' }
		},null,['user','product']);

		let matchCondition = { 
			$and: [
				{ category: isCategory._id.toString() },
				{ status: { $ne: "D" } },
				
			]
		}

		if (req.isVendor) {
			matchCondition.$and.push({
				vendor: req.vendor._id
			})
		}

		const pageSize = 10;
		const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
		let sortCriteria = { _id: -1 };
		if(req.query && req.query.sort) {
			if (req.query.sort=='atoz') {
				sortCriteria = { title: 1};
			} else if (req.query.sort=='ztoa') {
				sortCriteria = {title: -1};
			} else if (req.query.sort=='priceLow') {
				sortCriteria = {price: 1};
			} else if (req.query.sort='priceHigh') {
				sortCriteria = {price: -1};
			}
		}
		const searchValue = req.query.search;
		if (searchValue && searchValue.trim() !== "") {
			matchCondition.$and.push({
				$or: [
					{ title: { $regex: searchValue, $options: "i" } },
					{ sub_title: { $regex: searchValue, $options: "i" } },
					{ author: { $regex: searchValue, $options: "i" } },
					{ description: { $regex: searchValue, $options: "i" } },
					{ category: { $regex: searchValue, $options: "i" } },
				],
			});
		}

		if (req.query.filterBy && req.query.filterBy=='A' || req.query.filterBy=='P') {
			if (!matchCondition.$and) {
				matchCondition.$and = [{
					status: req.query.filterBy
				}]
			} else {
				matchCondition.$and.push({
					status: req.query.filterBy
				});
			}
		}
// Filter by origins
if (req.query.origins) {
	matchCondition.$and.push({
		origins: req.query.origins
	});
}

// Filter by missions
if (req.query.missions) {
	matchCondition.$and.push({
		missions: req.query.missions
	});
}
		let productsList = await makeMongoDbServiceProduct.getDocumentByCustomAggregation([
			{ $match: matchCondition },
			{ $sort: sortCriteria },
			{ $skip: skip },
			{ $limit: pageSize },
		]);

		console.log({productsList});

		productsList = productsList.map((product)=>{
			return {
				...product,
				reviews: reviews.filter((review)=> review.product && review.product._id.toString()==product._id.toString())
			}
		})
		productCount = await makeMongoDbServiceProduct.getCountDocumentByQuery(matchCondition);
		// isCategory = {
		// 	...isCategory._doc,
		// 	productsList
		// }
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
		isCategory = {
			...isCategory._doc,
			productsList,meta
		}
		return response(false, null, resMessage.success, isCategory,200,meta);
	} catch (error) {
		console.log(error);
		return response(true, null, error.message, error.stack,500);
	}
};
