import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const userMsg = req.body.msg;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a dark mystical oracle. Speak short and immersive."
          },
          {
            role: "user",
            content: userMsg
          }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "…silence…";

    res.send(reply);
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
