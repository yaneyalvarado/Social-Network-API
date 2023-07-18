const router = require("express").Router();

const {
  getThoughts,
  getThoughtById,
  createThought,
  removeThought,
  createReaction,
  removeReaction,
} = require("../../controller/thought-controller");

router.route("/").get(getThoughts);

router.route("/").post(createThought);

router
  .route("/:thoughtId")
  .get(getThoughtById)
  .put(createThought)
  .delete(removeThought);

router
  .route("/:thoughtId/reactions")
  .post(createReaction)
  .delete(removeReaction);

module.exports = router;
