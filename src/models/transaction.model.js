const mongoose = require("mongoose")
const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true, "Transaction must be associated with a from account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts",
        required: [true, "Transaction must be associated with a to account"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can either be PENDING, COMPLETED , FAILED OR REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, " Amount is required for creating a transaction"],
        min: [0, "Transaction amount accont be neg"]
    },
    //this key let the server do multiple transaction for same key due to network problem and all
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for creating a transaction"],
        index: true,
        unique: true
    },
},{
    timestamps:true

})

const transactionModel = mongoose.model("transaction", transactionSchema);
module.exports = {
    transactionModel
}