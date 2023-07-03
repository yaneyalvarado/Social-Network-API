const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: "Please enter a valid email address",
      unique: true,
      match: [
        // obtain code
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// obtaining 'friend count'
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// generate user model utilizing the user schema
const User = model("User", userSchema);

// export the user model
module.exports = User;
