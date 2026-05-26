const validateId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID — must be a positive number'
    });
  }
  req.params.id = id;
  next();
};

module.exports = validateId;