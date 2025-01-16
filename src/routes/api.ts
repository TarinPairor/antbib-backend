import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Api Route Working" });
});

router.post("/ai", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  // console.log("Received prompt:", prompt);
  // console.log("API Key exists:", !!apiKey);
  const url = "https://api.openai.com/v1/chat/completions";
  const APIBody = {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `
        You are a helpful assistant tasked with summarizing the input email thread.
      `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "email_summary",
        strict: true,
        schema: {
          type: "object",
          properties: {
            email_summary: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                  },
                  summary: {
                    type: "string",
                  },
                },
                required: ["user", "summary"],
                additionalProperties: false,
              },
            },
          },
          additionalProperties: false,
          required: ["email_summary"],
        },
      },
    },
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(APIBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error calling ChatGPT API:", error);
    res.status(500).json({ error: "Error calling ChatGPT API" });
  }
});

export default router;
