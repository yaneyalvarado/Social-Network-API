const { User, Thought } = require('../models');

//obtain all users
const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: ('__v')
        })
        .select('__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },
    // obtain single user by ID
    getSingleUser(req, res) {
        User.findOne({ _id: req.parmas.userId })
        .populate('thoughts')
        .populate('friends')
        .select("__v")
        .then((user) => 
        !user? res.status(404).json({ message: "No user found with this ID "})
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // generate user
    createUser({ body },, res) {
        console.log("BODY OBJECT", body)
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    },
    // update user info
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id"});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err));
    },
    // delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) => 
        !user
        ? res.status(404).json({ message: "No user found with this ID"})
        : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: "User and Thought deleted"}))
        .catch((err) => res.status(500).json(err));
    },
    // add a friend
    addFriend({ params }, res) {
        User.findByIdAndUpdate(
            { _id: params.id },
            { $addToSet: { friends: params.friendId } },
            { new: true }
        )
        .select("__v")
        .then((dbUserData) => {
            if (!dbUserData) => {
                res.status(404).json({ message: "No user found with this ID" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },
    // remove a friend 
    deleteFriend(req, res) {
        User.findOneAndUpdate(
          { _id: req.params.userId },
          { $pull: { friends: req.params.friendId } },
          { new: true }
        )
          .then(
            (user) =>
              !user
                ? res.status(404).json({ message: "No user found with this ID" })
                : res.json(user)
          )
          .catch((err) => res.status(500).json(err));
      },
    };