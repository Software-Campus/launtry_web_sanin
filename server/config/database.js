const mongoose = require("mongoose");
const connectDB = async () => {
    mongoose.connect("mongodb+srv://sanin:launtryapp123@cluster0.isc53r5.mongodb.net/database?retryWrites=true&w=majority");
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => console.log("Database Connected Successfully".bold.brightGreen));
};

module.exports = connectDB;
