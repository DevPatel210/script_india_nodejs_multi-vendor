/* eslint-disable */
function makeMongoDbService({ model }) {
	const createDocument = (data) =>
		new Promise((resolve, reject) => {
			model
				.create(data)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getDocumentById = (id, select = []) =>
		new Promise((resolve, reject) => {
			model
				.findOne({ _id: id }, select)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const updateDocument = (id, data) => {
		const newData = { ...data };
		delete newData.id;
		return new Promise((resolve, reject) => {
			model
				.updateOne({ _id: id }, newData, { new: true })
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	};

	const deleteDocument = (id) =>
		new Promise((resolve, reject) => {
			model
				.findByIdAndRemove(id)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getDocumentByQuery = (
		where,
		select = [],
		pageNumber,
		pageSize,
		sort = {}
	) =>
		new Promise((resolve, reject) => {
			if (!pageNumber && !pageSize) {
				model
					.find(where, select)
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			} else {
				model
					.find(where)
					.select(select)
					.sort(sort)
					.skip((parseInt(pageNumber) - 1) * parseInt(pageSize))
					.limit(parseInt(pageSize))
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			}
		});

	const getCountDocumentByQuery = (where) =>
		new Promise((resolve, reject) => {
			model
				.countDocuments(where)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getDocumentByQueryPopulate = (
		where,
		select = [],
		population = [],
		pageNumber,
		pageSize,
		sort = {}
	) =>
		new Promise((resolve, reject) => {
			if (!pageNumber && !pageSize) {
				model
					.find(where)
					.sort(sort)
					.populate(population)
					.select(select)
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			} else {
				model
					.find(where)
					.populate(population)
					.select(select)
					.sort(sort)
					.skip((parseInt(pageNumber) - 1) * parseInt(pageSize))
					.limit(parseInt(pageSize))
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			}
		});

	const getSingleDocumentByQueryPopulate = (
		where,
		select = [],
		population = [],
		sort = {}
	) =>
		new Promise((resolve, reject) => {
			model
				.findOne(where)
				.populate(population)
				.select(select)
				.sort(sort)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getSingleDocumentByIdPopulate = (id, select = [], population = []) =>
		new Promise((resolve, reject) => {
			model
				.findOne({ _id: id })
				.populate(population)
				.select(select)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getSingleDocumentById = (id, select = []) =>
		new Promise((resolve, reject) => {
			model
				.findOne({ _id: id }, select)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getSingleDocumentByQuery = (where, select = []) =>
		new Promise((resolve, reject) => {
			model
				.findOne(where, select)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	//  Request Query
	// {
	//     "query":{
	//         "and":[
	//             {"Name":"Dhiraj"},{"Salary":300}
	//         ],
	//         "or":[
	//           {"Name":"Dhiraj"},{"Salary":300}
	//         ]
	//     },
	//     "model":"Employee"
	// }

	const findExistsData = (data) => {
		// let { model } = data;
		const { query } = data;
		const { and } = query;
		const { or } = query;
		const q = {};

		if (and) {
			q.$and = [];
			for (let index = 0; index < and.length; index += 1) {
				q.$and.push(and[index]);
			}
		}
		if (or) {
			q.$or = [];
			for (let index = 0; index < or.length; index += 1) {
				q.$or.push(or[index]);
			}
		}

		return new Promise((resolve, reject) => {
			model
				.find(q)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	};

	const softDeleteDocument = (id) =>
		new Promise(async (resolve, reject) => {
			const result = await getSingleDocumentById(id);
			if (result) {
				result.status = 'D';
				delete result.id;
				model
					.updateOne({ _id: id }, result)
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			}
			resolve("No Data Found");
		});

	const hardDeleteDocument = (id) =>
		new Promise(async (resolve, reject) => {
			model.find({ _id: id }).remove().exec();
			resolve("No Data Found");
		});

	const softDeleteByQuery = (query) =>
		new Promise(async (resolve, reject) => {
			const result = await getSingleDocumentByQuery(query);
			if (result) {
				result.isDeleted = true;
				result.isActive = false;
				delete result.id;
				model
					.updateOne(query, result)
					.then((data) => {
						return resolve(data);
					})
					.catch((err) => {
						return reject(err);
					});
			}
			resolve("No Data Found");
		});
	const bulkInsert = (data) =>
		new Promise((resolve, reject) => {
			model
				.insertMany(data)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const bulkUpdate = (filter, data) =>
		new Promise((resolve, reject) => {
			model
				.updateMany(filter, data)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const countDocument = (where = {}) =>
		new Promise((resolve, reject) => {
			model.where(where).countDocuments((err, result) => {
				if (result !== undefined) {
					resolve(result);
				} else {
					reject(err);
				}
			});
		});
	const findOneAndUpdateDocument = (filter, data, options = {new: true}) =>
		new Promise((resolve, reject) => {
			model
				.findOneAndUpdate(filter, data, options)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	const findOneAndDeleteDocument = (filter, options = {}) =>
		new Promise((resolve, reject) => {
			model
				.findOneAndDelete(filter, options)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getDocumentByCustomAggregation = (array) =>
		new Promise((resolve, reject) => {
			model
				.aggregate(array)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});

	const getDocumentByAggregation = (query) => {
		let keyInJson, valuesOfAggregate;
		let valuesOfFields, keysOfFields;
		let input = {},
			finalInput = {},
			aggregate = {};
		let array = [];
		for (const [keys, values] of Object.entries(query)) {
			for (const [key, value] of Object.entries(values)) {
				switch (keys) {
					case "group":
						keyInJson = "key" in value;
						if (keyInJson) {
							valuesOfAggregate = Object.values(value);
							valuesOfFields = Object.values(valuesOfAggregate[0]);
							keysOfFields = Object.keys(valuesOfAggregate[0]);
							for (const [nestKey, nestValue] of Object.entries(
								valuesOfFields
							)) {
								if (Array.isArray(nestValue)) {
									input._id = `$${keysOfFields[nestKey]}`;
									for (const [i, j] of Object.entries(nestValue)) {
										finalInput[`$${key}`] = "";
										finalInput[`$${key}`] += `$${j}`;
										input[j] = finalInput;
										finalInput = {};
									}
									aggregate.$group = input;
									array.push(aggregate);
								} else {
									input._id = `$${keysOfFields[nestKey]}`;
									finalInput[`$${key}`] = "";
									finalInput[`$${key}`] = `$${nestValue}`;
									input[nestValue] = finalInput;
									aggregate.$group = input;
									array.push(aggregate);
								}
							}
						}
						aggregate = {};
						finalInput = {};
						input = {};
						break;

					case "match":
						valuesOfFields = Object.values(value).flat();
						keysOfFields = Object.keys(value);
						if (Array.isArray(valuesOfFields) && valuesOfFields.length > 1) {
							finalInput.$in = valuesOfFields;
							input[keysOfFields[0]] = finalInput;
						} else {
							input[keysOfFields[0]] = valuesOfFields[0];
						}
						aggregate.$match = input;
						array.push(aggregate);
						aggregate = {};
						input = {};
						finalInput = {};
						break;

					case "project":
						valuesOfFields = Object.values(value);
						if (valuesOfFields.length === 1) {
							const projectValues = Object.values(valuesOfFields[0]).toString();
							const projectKeys = Object.keys(valuesOfFields[0]).toString();
							const projectArr = [];

							if (isNaN(projectValues)) {
								projectArr.push(`$${projectKeys}`);
								projectArr.push(`$${projectValues}`);
							} else {
								projectArr.push(`$${projectKeys}`);
								projectArr.push(projectValues);
							}
							finalInput[`$${key}`] = projectArr;
							input[projectKeys] = finalInput;
							aggregate.$project = input;
							array.push(aggregate);
						}
						aggregate = {};
						input = {};
						finalInput = {};
						break;
				}
			}
		}
		return new Promise((resolve, reject) => {
			model
				.aggregate(array)
				.then((data) => {
					return resolve(data);
				})
				.catch((err) => {
					return reject(err);
				});
		});
	};

	return Object.freeze({
		createDocument,
		updateDocument,
		getDocumentByQuery,
		getCountDocumentByQuery,
		getDocumentByQueryPopulate,
		getSingleDocumentByQueryPopulate,
		getSingleDocumentByIdPopulate,
		getDocumentById,
		deleteDocument,
		getSingleDocumentById,
		findExistsData,
		softDeleteDocument,
		softDeleteByQuery,
		bulkInsert,
		bulkUpdate,
		countDocument,
		getSingleDocumentByQuery,
		findOneAndUpdateDocument,
		findOneAndDeleteDocument,
		getDocumentByCustomAggregation,
		getDocumentByAggregation,
		hardDeleteDocument,
	});
}
module.exports = makeMongoDbService;
