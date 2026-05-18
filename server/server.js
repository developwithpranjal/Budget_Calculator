const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const message =
      typeof req.body?.message === "string" ? req.body.message.trim() : "";

    if (!message) {
      return res.status(400).json({
        error: { message: "Missing or empty message in request body." },
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return res.status(500).json({
        error: {
          message:
            "Server is missing ANTHROPIC_API_KEY. Add it to server/.env and restart the backend.",
        },
      });
    }

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    const apiErr = error.response?.data;
    console.error(apiErr || error.message);
    const msg =
      apiErr?.error?.message ||
      apiErr?.message ||
      error.message ||
      "API request failed";
    res.status(error.response?.status || 500).json({
      error: { message: msg },
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});