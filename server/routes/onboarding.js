// server/routes/onboarding.js
const express = require("express");
const router = express.Router();
const Onboarding = require("../models/Onboarding"); // Import the model
const protect = require("../middleware/auth"); // ✅ FIX: Corrected import

// GET all onboarding records (Protected)
router.get("/", protect, async (req, res) => {
  try {
    const onboardingList = await Onboarding.find()
      .populate("candidate", "name email") // Populate candidate details
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.json(onboardingList);
  } catch (error) {
    console.error("Error fetching onboarding list:", error.message);
    res.status(500).json({ message: "Server error fetching onboarding data" });
  }
});

// POST - Initiate a new onboarding process (Example)
router.post("/", protect, async (req, res) => {
    const { candidateId, startDate } = req.body; // Get required data from request body

    if (!candidateId || !startDate) {
        return res.status(400).json({ message: "Candidate ID and Start Date are required." });
    }

    try {
        // Optional: Check if candidate exists
        // const candidate = await Candidate.findById(candidateId);
        // if (!candidate) return res.status(404).json({ message: "Candidate not found." });

        const newOnboarding = new Onboarding({
            candidate: candidateId,
            startDate: new Date(startDate), // Ensure it's a Date object
            documentsCompleted: false, // Default value
            status: "Initiated", // Default status
        });

        const savedOnboarding = await newOnboarding.save();
        // Optionally populate candidate data in the response
        const populatedOnboarding = await Onboarding.findById(savedOnboarding._id)
                                                .populate("candidate", "name email");

        res.status(201).json(populatedOnboarding);
    } catch (error) {
        console.error("Error initiating onboarding:", error.message);
        res.status(500).json({ message: "Server error initiating onboarding process" });
    }
});

 // PUT - Update an onboarding record (Example)
router.put("/:id", protect, async (req, res) => {
    const { id } = req.params;
    const { startDate, documentsCompleted, status } = req.body; // Fields that can be updated

    try {
        const updateData = {};
        if (startDate) updateData.startDate = new Date(startDate);
        if (documentsCompleted !== undefined) updateData.documentsCompleted = documentsCompleted;
        if (status) updateData.status = status; // Add validation if needed

        const updatedOnboarding = await Onboarding.findByIdAndUpdate(id, updateData, { new: true })
                                            .populate("candidate", "name email");

        if (!updatedOnboarding) {
            return res.status(404).json({ message: "Onboarding record not found." });
        }

        res.json(updatedOnboarding);
    } catch (error) {
        console.error("Error updating onboarding record:", error.message);
        res.status(500).json({ message: "Server error updating onboarding record" });
    }
});


// Add other routes as needed (GET by ID, DELETE, etc.)

module.exports = router;