import { db } from "../lib/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";

export const createProblem = async (req, res) => {
  // get all data from request body
  // check user role once again
  // loop through each refrence solution for different languages

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Forbidden - Only admins can create problems" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          error: `language ${language} is not supported`,
        });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}. Error: ${
              result.status.description
            }`,
            details: result,
          });
        }
      }

      //save problem in database

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          userId: req.user.id,
          examples,
          constraints,
          testCases,
          codeSnippets,
          referenceSolutions,
        },
      });

      console.log("Problem created successfully:", newProblem);

      return res.status(201).json({
        message: "Problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        error: "No problems found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error fetching problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.log("Error fetching problem by id:", error);
    return res.status(500).json({
      error: "Error fetching problem by id",
    });
  }
};

export const updateProblem = async (req, res) => {};

export const delteleProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) return res.status(404).json({ error: "Problem not found" });

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.log("Error delating problem", error);
    return res.status(500).json({
      error: "Error delating problem",
    });
  }
};

export const getAllProblemsSolvedByUser = async (req, res) => {};
