module.exports = function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const results = {};
      if (endIndex < (await model.countDocuments().exec())) {
        results.next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (skipIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit,
        };
      }
  
      try {
        results.results = await model.find()
          .sort({ _id: 1 })
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (e) {
        res
          .status(500)
          .json({ message: "Error Occured while fetching the data" });
      }
    };
  }