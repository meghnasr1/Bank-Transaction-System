
const mongoose = require('mongoose');




function connectToDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("server is connected to DB");
        })
        .catch( (err) => {
            console.log("Error connecting to db");
            process.exit(1);// we can stop the server here itself becuase db is not connected no point in keepoing server started
        
    })
}

module.exports = connectToDB;