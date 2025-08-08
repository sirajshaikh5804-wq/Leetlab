import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { db } from "../lib/db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    // Check authentication
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // problemId Check
    if (!problemId) {
      return res.status(400).json({ error: "Problem ID is required" });
    }

    // 1. Validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases" });
    }

    // 2. prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    //3. Send batch of submissions to judge0
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);

    //4. Poll judge0 to Get results of all submitted test cases
    const results = await pollBatchResults(tokens);
    if (!Array.isArray(results) || results.length === 0) {
      return res.status(500).json({ error: "No results from Judge0" });
    }

    console.log("----------");
    console.log("Executed Code Result:", results);

    // 5. Analyze test case results
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim() || "";
      const expected_output = expected_outputs[i]?.trim() || "";
      const passed = stdout === expected_output;
      if (!passed) allPassed = false;

      console.log(`Testcase #${i + 1}`);
      console.log(`Input: ${stdin[i]}`);
      console.log(`Expected Output: ${expected_output}`);
      console.log(`Actual Output: ${stdout}`);
      console.log(`Matched: ${passed}`);

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status?.description || null,
        memory: result.memory ?? null, // store as number
        time: result.time ?? null, // store as number
      };
    });

    console.log(detailedResults);

    // 6. Store submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        // stdin: JSON.stringify(stdin),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory !== null)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time !== null)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // 7. Mark problem as solved if all test cases passed
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: { userId, problemId },
      });
    }

    // 8. Store each test case result
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    // 9. Get submission with test cases
    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    res.status(200).json({
      success: true,
      message: "Code Executed Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
};
