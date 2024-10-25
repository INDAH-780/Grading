const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;
const router = express.Router();

app.use(cors());
app.use(express.json());

const GRADIO_URL = "https://7747a0194768d783da.gradio.live";
const questions = [
  "The rise of social media has impacted the way people communicate. To what extent do you agree or disagree?",
  "Some believe that the increasing reliance on technology has led to a decrease in face-to-face communication. Discuss both sides and give your opinion.",
  "Some people believe that children should be taught to be competitive in school, while others think they should be taught to cooperate. Discuss both views and give your opinion.",
  "In some countries, a high percentage of students drop out of school. What are the reasons for this, and what can be done to prevent it?",
];

// Random question route
app.get("/question", (req, res) => {
  const chosenQuestionIndex = Math.floor(Math.random() * questions.length);
  const chosenQuestion = questions[chosenQuestionIndex];
  res.send(chosenQuestion);
});

// Function to get predictions from the Gradio API
async function getPrediction(text) {
  try {
    const apiUrl = `${GRADIO_URL}/gradio_api/call/predict`;

    // Prepare the payload according to the Gradio API requirements
    const payload = {
      data: [text],
    };

    // First API call (POST)
    const postResponse = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("POST Response from Gradio:", postResponse.data);

    // Check for event_id in the response
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
    console.error(
      "Full error details:",
      error.response ? error.response.data : error
    );
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
