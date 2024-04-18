const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

const SALT = 12;
//! we are prefixed with /api/authentication

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // const regex = new RegExp("^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6,}$")

    const foundUser = await User.findOne({ email });
    // if we find someone, warn the user that the email is alrady used
    if (foundUser) {
      return res.status(400).json({ message: "This email is already in use" });
    }
    // We should hash the password and create the user

    const hashedPassword = await bcrypt.hash(password, SALT);

    const createdUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: "User created",
      id: createdUser._id,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email }, { password: 1, email: 1 });

    if (!foundUser) {
      return res.status(400).json({ message: "Wrong email" });
    }

    const correctPassword = await bcrypt.compare(password, foundUser.password);

    if (!correctPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Reasonably assume that they are the correct person

    const token = jwt.sign({ id: foundUser._id }, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    res.json({ authToken: token });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUserId);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/notes", isAuthenticated, async (req, res, next) => {
  try {
    const { card_id, content } = req.body;

    // Retrieve the current user
    const user = await User.findById(req.currentUserId);

    // Check if a note with the provided card_id already exists for the user
    const existingNoteIndex = user.notes.findIndex(
      (note) => String(note.card_id) === card_id
    );

    if (existingNoteIndex !== -1) {
      // Update the existing note
      user.notes[existingNoteIndex].content = content;
    } else {
      // Add a new note
      user.notes.push({ card_id, content });
    }

    // Save the updated user document
    await user.save();

    res.status(201).json({ message: "Note added/updated successfully", user });
  } catch (error) {
    next(error);
  }
});

router.delete("notes/:cardId", isAuthenticated, async (req, res, next) => {
  try {
    const { cardId } = req.params;

    // Retrieve the current user
    const user = await User.findById(req.currentUserId);

    // Find the index of the note with the provided cardId
    const noteIndex = user.notes.findIndex(
      (note) => String(note.card_id) === cardId
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Remove the note from the notes array
    user.notes.splice(noteIndex, 1);

    // Save the updated user document
    await user.save();

    res.json({ message: "Note deleted successfully", user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
