const { Schema, model } = require("mongoose");

const cardSchema = new Schema(
  {
    deck_position: {
      type: Number,
      required: [true, "Deck position is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    name_short: {
      type: String,
      required: [true, "Short name is required."],
    },
    arcana: {
      type: String,
      required: [true, "Arcana type is required."],
    },
    suit: {
      type: String,
      required: [false],
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, "Value is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    interpretation: {
      upright: {
        type: String,
        required: [true, "Upright interpretation is required."],
      },
      reversed: {
        type: String,
        required: [true, "Reversed interpretation is required."],
      },
    },
    image: {
      upright: {
        type: String,
        required: [true, "Upright image URL is required."],
      },
      reversed: {
        type: String,
        required: [true, "Reversed image URL is required."],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Card = model("Card", cardSchema);

module.exports = Card;
