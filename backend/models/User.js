const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlenght: 6,
        maxlength: 20,
        unique: true
    },
    email:{
        type: String,
        required: true,
        minlenght: 10,
        maxlength: 20,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlenght: 6,
        
    },
    admin:{
        type: Boolean,
        default: false,
    }
},
{
    timestamps: true,
}
);
module.exports = mongoose.model("User", userSchema);