const mongoose = require("mongoose");

mongoose.connect(`${process.env.MONGOURL}expenseTracker`);

const conn = mongoose.connection;

conn.on("open", () => {
  console.log("Database Connected Successfully");
});

conn.on("error", (err) => {
  console.log("ERROR >>>>>", err);
});

module.exports = mongoose
