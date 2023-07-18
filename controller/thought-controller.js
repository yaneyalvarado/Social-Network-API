const { Thought, User } = require("../models");

// get all thoughts
const thoughtController = {
  getThoughts(req, res) {
    Thought.find({})
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // obtain a single thought, by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("__v")
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought found with this ID" });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // generate a thought with user id
  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { email: req.body.email },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No user find with this ID" })
          : res.json(thought)
      )
      .catch((err) => console.log(err));
  },
  // remove a thought
  removeThought({ params }, res) {
    thought
      .findOneAndDelete({ _id: params.thoughtId })
      .then((deletedthought) => {
        if (!deletedthought) {
          return res.status(404).json({ message: "No thought with this id" });
        }
        return User.findOneAndUpdate(
          { _id: params.username },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // generate reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // remove a reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughId },
      { $pull: { reactions: { reactionId: params.reactionID } } },
      { new: true }
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
