import { Job } from "../models/job.model.js";
//Admin job posting
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    res.status(201).json({
      message: "Job posted successfully.",
      job,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Users
// export const getJobById = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const job = await Job.findById(jobId).populate({
//       path: "applications",
//     });
//     if (!job) {
//       return res.status(404).json({ message: "Job not found", status: false });
//     }
//     return res.status(200).json({ job, status: true });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server Error", status: false });
//   }
// };

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found", status: false });
    }

    return res.status(200).json({ job, status: true });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

//Admin job created

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
      sort: { createdAt: -1 },
    });
    if (!jobs) {
      return res.status(404).json({ message: "No jobs found", status: false });
    }
    return res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};


export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const {
      title,
      description,
      requirements,
      salary,
      jobType,
      experience,
      position,
    } = req.body;

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({
        message: "Job not found",
        status: false,
      });
    }

    if (existingJob.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized to edit this job",
        status: false,
      });
    }

    // update
    existingJob.title = title?.trim() || existingJob.title;
    existingJob.description = description?.trim() || existingJob.description;
    existingJob.requirements = requirements
      ? requirements.split(",").map(r => r.trim())
      : existingJob.requirements;
    existingJob.salary = salary !== undefined ? Number(salary) : existingJob.salary;
    existingJob.jobType = jobType?.trim() || existingJob.jobType;
    existingJob.experienceLevel =
      experience !== undefined ? experience : existingJob.experienceLevel;
    existingJob.position =
      position !== undefined ? position : existingJob.position;

    await existingJob.save();

    return res.status(200).json({
      message: "Job updated successfully",
      job: existingJob,
      status: true,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};