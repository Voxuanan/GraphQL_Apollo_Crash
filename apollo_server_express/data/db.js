const Authors = require("../models/Author");
const Books = require("../models/Book");

const mongoDataMethods = {
    getAllBooks: async (objectQuery = null) =>
        objectQuery == null ? await Books.find() : await Books.find(objectQuery),
    getBookById: async (id) => await Books.findById({ _id: id }),
    getAllAuthors: async () => await Authors.find(),
    getAuthorById: async (id) => await Authors.findById({ _id: id }),
    createAuthor: async (args) => {
        const newAuthor = new Authors(args);
        return await newAuthor.save();
    },
    createBook: async (args) => {
        const newBook = new Books(args);
        return await newBook.save();
    },
};

module.exports = mongoDataMethods;
