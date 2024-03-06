 function asyncHandler(handler) {
    return function(req, res, next) {
      return Promise
        .resolve(handler(req, res, next))
        .catch(next);
    };
}

export {asyncHandler};