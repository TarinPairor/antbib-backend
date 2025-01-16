"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.json({ message: "Api Route Working" });
});
router.post("/ai", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify(APIBody),
        });
        if (!response.ok) {
            const errorData = yield response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error("Error calling ChatGPT API:", error);
        res.status(500).json({ error: "Error calling ChatGPT API" });
    }
}));
exports.default = router;
