import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from '../utils/cloud.js';


export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(401).json({
        message: "Company name is required",
        success: false,
      });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(401).json({
        message: "Company already exists",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const userId = req.id; // loggedin user id
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({ message: "No companies found" });
    }
    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

//get company by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error(error);
  }
};



export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    // Find existing company first
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found", success: false });
    }

    // Prepare updated fields dynamically
    const updateData = {};

    if (name && name !== company.name) updateData.name = name;
    if (description && description !== company.description) updateData.description = description;
    if (website && website !== company.website) updateData.website = website;
    if (location && location !== company.location) updateData.location = location;

    // If a new file is uploaded, replace logo
    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;
    }

    // If no changes detected
    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        message: "No changes detected. Company data remains the same.",
        success: true,
        company,
      });
    }

    // Update only modified fields
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      message: "Internal server error while updating company",
      success: false,
    });
  }
};