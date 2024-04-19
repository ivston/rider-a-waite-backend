const router = require("express").Router();
const Reading = require("./../models/Reading.model.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");

// POST /api/readings
// Create a new reading
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { spreadType, cardsInOrder, aiInterpretation, notes } = req.body;
    const querentId = req.currentUserId; // The logged-in user's ID

    // Create the reading
    const newReading = await Reading.create({
      querentId,
      spreadType,
      cardsInOrder,
      aiInterpretation,
      notes,
    });

    res.status(201).json(newReading);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/readings/:readingId
// Delete a reading by its ID
router.delete("/:readingId", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;

    // Find the reading by ID and delete it
    const deletedReading = await Reading.findByIdAndDelete(readingId);

    if (!deletedReading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    res.json({ message: "Reading deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// POST /api/readings/:readingId
// Add or update notes to a reading by its ID
router.post("/:readingId", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;
    const { notes } = req.body;

    // Find the reading by ID
    const reading = await Reading.findById(readingId);

    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    // Check if notes exist for the reading
    if (reading.notes) {
      // Update existing notes
      reading.notes = notes;
    } else {
      // Create new notes
      reading.notes = notes;
    }

    // Save the updated reading
    await reading.save();

    res.json(reading);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/readings/:readingId/notes
// Delete the content of the notes associated with a reading by its reading ID
router.delete("/:readingId/notes", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;

    // Find the reading by ID
    const reading = await Reading.findById(readingId);

    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    // Check if notes exist for the reading
    if (!reading.notes) {
      return res
        .status(404)
        .json({ message: "No notes found for the reading" });
    }

    // Delete the content of the notes associated with the reading
    reading.notes = "";

    // Save the updated reading
    await reading.save();

    res.json({ message: "Note content deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
