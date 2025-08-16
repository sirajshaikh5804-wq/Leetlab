import { db } from "../lib/db.js";

export const getAllSubmission = async (req, res) => {
  try {
    const userId = req.user.id;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "submission fetched successfully",
      submission,
    });
  } catch (error) {
    console.error("submission fetch error", error);
    res.status(500).json({ error: "failed to fetch submission" });
  }
};

export const getSubmissionForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submission = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "submission fetched successfully",
      submission,
    });
  } catch (error) {
    console.error("failed to fetch get submission for problem", error);
    res
      .status(500)
      .json({ error: "failed to fetch get submission for problem" });
  }
};

export const getAllSubmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });
    res.status(200).json({
      success: true,
      message: "get All submission fetched success",
      count: submission,
    });
  } catch (error) {
    console.error("failed to fetch get Allsubmission for problem", error);
    res
      .status(500)
      .json({ error: "failed to fetch get Allsubmission for problem" });
  }
};
