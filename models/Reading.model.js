const { Schema, model } = require("mongoose");

const readingSchema = new Schema(
  {
    querentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Querent ID is required."],
    },
    spreadType: {
      type: String,
      required: [true, "Spread type is required."],
    },
    cardsInOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: [true, "Card IDs are required."],
      },
    ],
    aiInterpretation: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reading = model("Reading", readingSchema);

module.exports = Reading;
