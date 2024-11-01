const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 5000;
const router = express.Router();

app.use(cors());
app.use(express.json());

const GRADIO_URL = "https://42dd9f21c6d7d7dafd.gradio.live";


const loadQuestions = async () => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "question.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading questions:", error);
    return []; 
  }
};

app.get("/question", async (req, res) => {
  const questions = await loadQuestions();
  if (questions.length === 0) {
    return res.status(500).send("No questions available");
  }

  const chosenQuestionIndex = Math.floor(Math.random() * questions.length);
  const chosenQuestion = questions[chosenQuestionIndex];
  
  // Format constraints as a readable string, using interpolators
  const constraints = `Word limit: ${chosenQuestion.constraints.minWords}-${chosenQuestion.constraints.maxWords}, ` +
                      `Character limit: ${chosenQuestion.constraints.minChars}-${chosenQuestion.constraints.maxChars}, ` +
                      `Sitting time: ${chosenQuestion.constraints.minTime}-${chosenQuestion.constraints.maxTime} minutes`;

  const formattedResponse = {
    questionText: chosenQuestion.questionText,
    constraints
  };

  res.json(formattedResponse);
});


// Function to get predictions from the Gradio API
async function getPrediction(text) {
  try {
    const apiUrl = `${GRADIO_URL}/gradio_api/call/predict`;
    const payload = { data: [text] };

    // First API call (POST)
    const postResponse = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("POST Response from Gradio:", postResponse.data);

    if (!postResponse.data || !postResponse.data.event_id) {
      throw new Error("POST response from Gradio did not contain event_id");
    }

    const { event_id } = postResponse.data;

    // Second API call (GET)
    const getResponse = await axios.get(`${apiUrl}/${event_id}`);
    console.log("GET Response from Gradio:", getResponse.data);

    return getResponse.data;
  } catch (error) {
    console.error("Error communicating with Gradio:", error.message);
    throw new Error("Error communicating with Gradio: " + error.message);
  }
}

// Controller to handle essay submission and call Gradio API
const submitEssay = async (req, res) => {
  const { essay } = req.body;
  console.log("Received essay:", essay);
  try {
    const result = await getPrediction(essay);
    console.log("Prediction result:", result);
    res.json(result);
  } catch (error) {
    console.error("Error processing essay grading:", error);
    res.status(500).json({ error: "Error processing essay grading" });
  }
};

// Set up the essay submission route
router.post("/submit", submitEssay);

// Use the router in the main app
app.use("/api", router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
