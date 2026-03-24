const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("OK WORKING");
});

// AI ENDPOINT
app.post("/ai", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const msg = req.body.msg;

    if (!msg) {
      return res.status(400).send("No message");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You are a dark oracle. Short answers." },
          { role: "user", content: msg }
        ]
      })
    });

    const data = await response.json();

    console.log("AI RESPONSE:", data);

    const reply = data?.choices?.[0]?.message?.content || "No response";

    res.send(reply);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).send("ERROR");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
