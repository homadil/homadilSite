const validateUpload = (req, res, next) => {
  try {
    // If "show" is a string (not a file), set it to null
    if (req.body.show && typeof req.body.show === "string") {
      req.body.show = null;
    }

    // If "files" contains strings, set it to an empty array
    if (req.body.files && Array.isArray(req.body.files)) {
      req.body.files = req.body.files.filter(
        (file) => typeof file === "object"
      );
    }

    next();
  } catch (error) {
    console.error("Error while validating files:", error);
    next();
  }
};

module.exports = validateUpload;
