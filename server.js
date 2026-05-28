const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// serve static files from the folder that contains index.html
app.use(express.static(path.join(__dirname)));

// optional: explicit root route to send index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ✅ Connect to MongoDB (only once, no old options)
mongoose.connect("mongodb://localhost:27017/shecan")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Schema properly
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});
const Form = mongoose.model("Form", formSchema);

// ✅ Route to handle submissions
app.post("/api/submit", async (req, res) => {
  console.log("Received body:", req.body);
  try {
    const formData = new Form(req.body);
    await formData.save();
    console.log("Saved:", formData);
    res.status(200).send("Form submitted successfully");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("Error submitting form");
  }
});


// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
