const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required"],
      minLength: [3, "Title must be ateast 3 characters long"],
      maxLenght: [15, "Title must not exceed more than 15 characters"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is Required"],
    },
    category: {
      type: String,
      require: [true, "Category is Required"],
      minLength: [3, "Category must be atleast 3 characters long"],
      maxLenght: [50, "Category must not exceed more than 50 characters"],
      lowercase: true,
      trim: true,
    },
    remark: {
      type: String,
      required: [true, "Remark is Required"],
      minLength: [3, "Remark must be atleast 3 characters long"],
      maxLength: [125, "Remark must not exceed more than 125 characters"],
      trim: true,
    },
    paymentmode: {
      type: String,
      required: [true, "Payment Mode is Required"],
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "Cheque",
        "UPI",
      ],
    },
  },
  { timestamps: true }
);

const ExpenseSchema = mongoose.model("expense", expenseSchema);

module.exports = ExpenseSchema;
