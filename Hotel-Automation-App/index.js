var express = require("express");
var mongoose = require("mongoose");
var app = express();
const https = require("https");
const bodyParser = require("body-parser");
//Set view engine to EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// -----------COnnection to DataBase ---------------------- //
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dbuser:qwe123@cluster0.ueb1t.mongodb.net/hotel?retryWrites=true&w=majority"
);
//Verify connection
mongoose.connection
  .once("open", function () {
    console.log("Connection  to DB has been made");
  })
  .on("error", function () {
    console.log("Connection to DB error");
  });

//----------------var_declarations---------------------------//
let users = require("./models/user");
const userProcess = require("./src/processAuthReq");

let reservations = require("./models/reservations");
const reservProcess = require("./src/processReservationReq");

let rooms = require("./models/rooms");
const roomService = require("./src/processRoomManagement");
//-----------------------------------------------------------//

//Showing login form
app.get("/", function (req, res) {
  res.render("login");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/security-code", function (req, res) {
  res.render("security-code");
});

//----guest
app.get("/home-page", function (req, res) {
  res.render("home-page");
});

app.get("/my-reservations", function (req, res) {
  const params = req.param("reservations");
  let urlDecode = JSON.parse(params);
  res.render("my-reservations", {
    reservations: urlDecode,
  });
});


app.get("/find-option", function (req, res) {
  const params = req.param("rooms");
  let urlDecode = JSON.parse(params);
  res.render("find-option", {
    rooms: urlDecode,
  });
});

//--- admin
app.get("/rooms", function (req, res) {
  const params = req.param("rooms");
  let urlDecode = JSON.parse(params);
  res.render("rooms", {
    rooms: urlDecode,
  });
});
app.get("/reservations", function (req, res) {
  const params = req.param("reservations");
  let urlDecode = JSON.parse(params);
  res.render("reservations", {
    reservations: urlDecode,
  });
});

// ------- post methods -------- //

// --- Authentication
app.post("/login", function (req, res) {
  console.log("login");
  userProcess.loginRequest(req, res, users).then((value) => {
    console.log("login done: " + value);
  });
});

app.post("/security-code", function (req, res) {
  userProcess.securityCodeRequest(req, res, rooms);
});

// --- reservation for guest
app.post("/home-page", function (req, res) {
  reservProcess.getAllAvailableRoomsForInterval(req, res, reservations, rooms);
});
app.post("/reserve", function (req, res) {
  reservProcess.addReservation(req, res, reservations);
});

app.post("/my-reservations", function (req, res) {
  reservProcess.getAllReservationForUser(res, reservations, rooms);
});

//------------------------------ //
app.post("/reservations", function (req, res) {
  reservProcess.showAllReservationForAdmin(res, reservations, rooms, users);
});

app.post("/search-reserv-by-room", function (req, res) {
  reservProcess.showAllReservationByRoom(res, req, reservations, rooms, users);
});

app.post("/search-by-date", function (req, res) {
  reservProcess.showAllReservationForInterval(res, req, reservations, rooms, users);
});

app.post("/rooms", function (req, res) {
  roomService.getAllRooms(rooms).then((roomsToShow) => {
    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
});
});

// ---------------------------- //

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port 3000!");
});
