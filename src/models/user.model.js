const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")



const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address"
            
        ],
        unique: [true, "Email already exists"]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a account"]

    },
    password: {
        type: String,
        required: [true, "Password is requred for creating account"],
        minlenght: [6, "Password should contain more then 6 letters"],
        select: false // this measn when we will fetch any data of user the passowrd will not come along with other data 
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true, // u can only change this via db not code or anything, bu default users will not be sytem users also we will create a system user then via that user we will create a system bank account
        select:false, // when we want to read data filter out system user
    },
}, {
    timestamps: true // when was the user created or when was the user data was updated.
});



// this function means whenever u will save the user data , before that this function will run 


// we never store the password as plain text , we always create hash of the password and then store it.
// using hashing algo we change password , its one way.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return  // if not modified return 
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return ;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
} // here we will get true pr false on the basis of password is true or false.


const userModel = mongoose.model("user", userSchema);
module.exports = userModel;