const router = require("express").Router();
const Card = require("./../models/Card.model.js");
const Reading = require("./../models/Reading.model.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");

// POST /api/readings/:spreadType
// Generate a new reading based on the selected spread type
router.post("/:spreadType", isAuthenticated, async (req, res, next) => {
  try {
    const { spreadType } = req.params;
    let numCards;
    switch (spreadType) {
      case "one-card":
        numCards = 1;
        break;
      case "three-card":
        numCards = 3;
        break;
      case "celtic-cross":
        numCards = 10;
        break;
      default:
        return res.status(400).json({ message: "Invalid spread type" });
    }

    // Generate unique random numbers within the range of deck_position
    const randomPositions = generateUniqueRandomNumbers(0, 77, numCards);
    //console.log(randomPositions);

    // Retrieve cards corresponding to the random positions
    const cards = await Card.find({ deck_position: { $in: randomPositions } });
    console.log(cards);

    // Create the reading in the database
    const newReading = new Reading({
      querentId: req.currentUserId,
      spreadType,
      cardsInOrder: cards.map((card) => card._id),
    });

    await newReading.save();

    res.status(201).json({ reading: newReading, cards });
  } catch (error) {
    next(error);
  }
});

// Function to generate unique random numbers within a range
function generateUniqueRandomNumbers(min, max, count) {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
}

// GET /api/readings/:readingId
// Retrieve a specific reading by its ID
router.post("/:readingId", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;
    const reading = await Reading.findById(readingId).populate("cardsInOrder");
    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }
    res.json(reading);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/readings/:readingId
// Delete a reading by its ID
router.delete("/:readingId", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;
    const deletedReading = await Reading.findByIdAndDelete(readingId);
    if (!deletedReading) {
      return res.status(404).json({ message: "Reading not found" });
    }
    res.json({ message: "Reading deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// POST /api/readings/:readingId/notes
// Add or update notes to a reading by its ID
router.post("/:readingId/notes", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;
    const { notes } = req.body;

    const reading = await Reading.findById(readingId);
    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    reading.notes = notes;
    await reading.save();

    res.json(reading);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/readings/:readingId/notes
// Delete notes associated with a reading by its ID
router.delete("/:readingId/notes", isAuthenticated, async (req, res, next) => {
  try {
    const { readingId } = req.params;

    const reading = await Reading.findById(readingId);
    if (!reading) {
      return res.status(404).json({ message: "Reading not found" });
    }

    reading.notes = "";
    await reading.save();

    res.json({ message: "Notes deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
