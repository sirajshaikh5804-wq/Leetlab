import { pollBatchResults, submitBatch } from "../lib/judge0.lib.js";

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_output, problemId } =
    req.body;
  const userId = req.user.id;
  try {
    //1. validate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missinng test cases" });
    }

    //2. prepare each test cases for judge0 batch submission
    const submissions = stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input,
    }))

    //3. Send batch of submissions to judge0
    const submitRespone= await submitBatch(submissions)
    const tokens= submitRespone.map((res)=>res.token)

    //4. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens)

    console.log(`execution code Result`, results)

    res.status(200).json({
        message: "code executed"
    })
  } catch (error) {}
};
