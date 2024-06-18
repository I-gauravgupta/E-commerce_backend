const {Brand}=require("../models/brandModel");

//create 
const createBrand = async (req, res) => {
    try {
      const brand = await new Brand(req.body);
      const newBrand = await brand.save();
      res.json(newBrand);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //update
  const updateBrand =async (req, res) => {
    const { id } = req.query;
    try {
      const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedBrand);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //delete 
  const deleteBrand = async (req, res) => {
    const { id } = req.query;
    try {
      const deletedBrand = await Brand.findByIdAndDelete(id);
      res.json(deletedBrand);
    } catch (error) {
      throw new Error(error);
    }
  };
  
  //get 
  const getBrand = async (req, res) => {
    const { id } = req.query;
    try {
      const getaBrand = await Brand.findById(id);
      res.json(getaBrand);
    } catch (error) {
      throw new Error(error);
    }
  };


  const getallBrand = async (req, res) => {
    try {
      const getallBranddetails = await Brand.find();
      res.json(getallBranddetails);
    } catch (error) {
      throw new Error(error);
    }
  };
  module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand,
  };