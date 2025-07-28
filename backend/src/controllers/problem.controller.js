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
      return res.status(201).json({
        message: "Problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {}
};

export const getAllProblems = async (req, res) => {};

export const getProblemById = async (req, res) => {};

export const updateProblem = async (req, res) => {};

export const delteleProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
