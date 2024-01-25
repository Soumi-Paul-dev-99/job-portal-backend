const asyncHandler = require("express-async-handler");
const jobModel = require("../models/jobModel");
const mongoose = require("mongoose");
const moment = require("moment");

// create job

exports.createJobController = asyncHandler(async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new Error("please provide all fields");
  }
  req.body.createdBy = req.user.id;
  const job = await jobModel.create(req.body);
  res.status(201).json({ job });
});

/////    get job  ///////
exports.getAlljobs = asyncHandler(async (req, res) => {
  const { status, workType, search, sort } = req.query;
  //condition foe searching filters
  const queryObject = {
    createdBy: req.user.id,
  };

  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobModel.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  const jobs = await queryResult;

  // const jobs = await jobModel.find({ createdBy: req.user.id });
  res.status(200).json({
    totalJobs: jobs.length,
    jobs,
  });
});

// update jobs ////
exports.updateJobController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const { company, position } = req.body;

  //validation
  if (!company || !position) {
    throw new Error("please provide all fields");
  }

  //find job
  const job = await jobModel.findOne({ _id: id });
  //validation
  if (!job) {
    throw new Error(`no jobs found with this id ${id}`);
  }
  if (!req.user.id === job.createdBy.toString()) {
    throw new Error("Your not Authorized to update this job");
    return;
  }
  const updateJob = await jobModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ updateJob });
});

//// delete controller /////
exports.deleteJobController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //find job
  const job = await jobModel.findOne({ _id: id });

  //validation
  if (!job) {
    throw new Error(`No Job found with this ID ${id}`);
  }
  if (!req.user.id === job.createdBy.toString()) {
    throw new Error(`your not authorize to delete this job`);
    return;
  }
  await job.deleteOne();
  res.status(200).json({ message: "Success" });
});

//  jobs stats and filters //

exports.jobStatsController = asyncHandler(async (req, res) => {
  const stats = await jobModel.aggregate([
    //search by user job
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  // console.log("stats", stats);
  res
    .status(200)
    .json({ totalJobs: stats.length, defaultStats, monthlyApplication });
});
