const Category = require("../database/models/Category");

// CREATE - Add a new category
const create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      msg: category.name + " has been updated successfully",
      ...category.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a single category by ID
const getById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (PUT) - Update an entire category by ID
const update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.update(req.body);
    res.status(200).json({
      msg: category.name + " has been updated successfully",
      ...category.dataValues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a category by ID
const partialUpdate = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.update(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.status(204).json({ msg: category.name + "was deleted successfully" });
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
  delete: deleteCategory,
};
