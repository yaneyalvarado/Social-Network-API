const { Schema, model, Types } = require("mongoose");
// value date.js to format the timestamp
const dateFormat = require("../utils/dates");

// reaction schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: "Please enter your reaction",
    },
    username: {
      type: String,
      required: "Please enter your username",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// thought schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// obtain total count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// gennerate the User model utilizing the user schema
const Thought = model("Thought", thoughtSchema);

// export the thought model
module.exports = Thought;
