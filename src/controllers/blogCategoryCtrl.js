const {blogCategory}=require("../models/blogCategoryModel");

//create category
const createCategory = async (req, res) => {
    try {
      const category = await new blogCategory(req.body);
      const newCategory = await category.save();
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //update category
  const updateCategory =async (req, res) => {
    const { id } = req.query;
    try {
      const updatedCategory = await blogCategory.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedCategory);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //delete category
  const deleteCategory = async (req, res) => {
    const { id } = req.query;
    try {
      const deletedCategory = await blogCategory.findByIdAndDelete(id);
      res.json(deletedCategory);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //get category
  const getCategory = async (req, res) => {
    const { id } = req.query;
    try {
      const getaCategory = await blogCategory.findById(id);
      res.json(getaCategory);
    } catch (error) {
      throw new Error(error);
    }
  };
  const getallCategory = async (req, res) => {
    try {
      const getallCategory = await blogCategory.find();
      res.json(getallCategory);
    } catch (error) {
      throw new Error(error);
    }
  };
  module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory,
  };