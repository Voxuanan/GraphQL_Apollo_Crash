const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        name: { type: String },
        genre: { type: String },
        authorId: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("book", bookSchema);
