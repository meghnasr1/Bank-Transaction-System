const express = require("express");
const cookieparser = require("cookie-parser");


/**
 * -Routers
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.route")
const transactionRoutes = require("./routes/transaction.routes")

const app = express();

/**
 * -middlewares
 */
app.use(express.json()) // we use this middleware so the express server can read body data
app.use(cookieparser())


/**
 * - Use Routes
 */
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)


module.exports = app;