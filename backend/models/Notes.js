const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

NoteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

module.exports = mongoose.model("Note", NoteSchema);
