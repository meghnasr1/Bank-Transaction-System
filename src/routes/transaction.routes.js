const express = require("express");
const authMiddleware = require("../middleware/auth.middleware")
const transactionRouter = express.Router();
const createTransaction = require("../controllers/transaction.controller")
/**
 * -POST /api/transactions/
 * -Create a new transaction
 */
transactionRouter.post("/", authMiddleware.authMiddleware, createTransaction.createTransaction)

/**
 * - POST /api/transaction/system/initial-fund
 * -Create initail funds transaction from system user
 */
transactionRouter.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,createTransaction.createInitialFundsTransaction)

module.exports = transactionRouter

