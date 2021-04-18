const { Int32 } = require("bson");
var mongoose=require("mongoose");
var reservationsSchema=mongoose.Schema({
    reservationId: {type: Number, required: true, unique: true},
    userId: { type: Number, required: true },
    roomId: { type: Number, required: true },
    startDate: { type: Date, required: true},
    endDate: { type: Date, required: true},
    status: { type: Number, required: true, default: 0 }
}, { collection : 'reservations' });

module.exports=mongoose.model("Reservations", reservationsSchema);