const Tag = require("../database/models/Tag");

// CREATE - Add a new tag
const create = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res
      .status(201)
      .json({ msg: tag.name + " was created successfully", ...tag.dataValues });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all tags
const getAll = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a single tag by ID
const getById = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (PUT) - Update an entire tag by ID
const update = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await tag.update(req.body);
    res.status(200).json({
      msg: tag.name + " has been updated successfully",
      ...tag.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a tag by ID
const partialUpdate = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await tag.update(req.body);
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a tag by ID
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    await tag.destroy();
    res.status(204).json({ msg: tag.name + "was deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  partialUpdate,
  delete: deleteTag,
};
