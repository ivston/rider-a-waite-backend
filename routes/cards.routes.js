const router = require("express").Router();
const Card = require("./../models/Card.model.js");
//! We are prefixed with /api/cards

router.get("/", async (req, res, next) => {
  try {
    const search = generateSearch(req.query);

    console.log(req.query);
    const projections = {
      name: 1,
      description: 1,
      image: 1,
    };

    const allCards = await Card.find(search, projections);
    res.json(allCards);
  } catch (error) {
    next(error);
  }
});

function generateSearch(query) {
  const search = {};

  if (query.name) {
    search.name = new RegExp(query.name, "i");
  }

  //console.log("Generated search:", search);

  return search;
}

router.get("/:cardId", async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const oneCard = await Card.findById(cardId);
    if (!oneCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json({ oneCard });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
