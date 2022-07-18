const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
    {
        name: { type: String },
        age: { type: Number },
    },
    { timestamps: true }
);

module.exports = mongoose.model("author", authorSchema);
