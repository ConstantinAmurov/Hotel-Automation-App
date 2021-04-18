const { Int32 } = require("bson");
var mongoose=require("mongoose");
// var passportlocalmongoose=require("passport-local-mongoose");
var userSchema=mongoose.Schema({
    userId: {type: Number, required: true, unique: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: false },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    securityCode: {type: Number, required: false},
    role: {type: Number, required: true}
}, { collection : 'user' });

// userSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User", userSchema);