const express = require("express");
const fetch = require("node-fetch");

const app = express();

// TEST
app.get("/", (req, res) => {
  res.send("OK WORKING");
});

// 🔥 TEK ENDPOINT (GET)
app.get("/ask", async (req, res) => {
  try {
    const msg = req.query.msg;

    if (!msg) {
      return res.send("No message");
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

    const reply = data?.choices?.[0]?.message?.content || "No response";

    res.send(reply);

  } catch (err) {
    console.log(err);
    res.send("ERROR");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
