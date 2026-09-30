const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model")

const accountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", 'CLOSED'],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
            
        },
        default:"ACTIVE"

    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    },
}, {
    timestamps: true

})
// for storing balance we will use leiser ,as we dont store amount or balance directly in the DB directly 
//1 only means the order is A to Z, or smallest to largest. It is not "index number 1.
// we are creatng compound index 
//accountModel.find({ user: riyaId, status: "ACTIVE" })
//MongoDB goes straight to Riya, then straight to ACTIVE, and returns one row. It does not look at Amit or Neha.
accountSchema.index({ user: 1, status: 1 });


accountSchema.method.getBalance = async function () {
    const balanceData = await ledgerModel.aggreagate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                    
                }
            }
        }, {
            $project: {
                _id: 0,
                balance:{$subtract:["$tottalCredit","$totalDebit"]}
            }
        }
    ])
    if (balanceData.length === 0) {
        return 0
    }
    return balanceData[ 0 ].balance
}

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;