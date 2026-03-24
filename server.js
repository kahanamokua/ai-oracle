import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// TEST
app.get("/", (req, res) => {
  res.send("OK WORKING");
});

// ORACLE ENDPOINT
app.get("/ask", async (req, res) => {
  const msg = req.query.msg;

  if (!msg) {
    return res.send("No message");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a mystical oracle. Answer briefly and powerfully."
          },
          {
            role: "user",
            content: msg
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.send("No response from AI");
    }

    const reply = data.choices[0].message.content;

    res.send(reply);

  } catch (err) {
    res.send("Server error");
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
