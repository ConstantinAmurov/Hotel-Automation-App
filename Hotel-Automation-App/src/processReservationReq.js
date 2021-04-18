/**
 * Will use to get the user
 */
const userService = require("./processAuthReq");

/**
 * memorise the start date for reservation
 */
let startDateForGuest;
/**
 * memorise the end date for reservation
 */
let endDateForGuest;

/**
 * The list with all rooms.
 */
let roomList;

/**
 * Search available rooms for an interval
 * @param {*} req 
 * @param {*} res 
 * @param {*} reservations - reservation model from database, needed to get all reservations
 * @param {*} rooms - rooms model from database, needed to get all rooms
 * @returns 
 */
function getAllAvailableRoomsForInterval(req, res, reservations, rooms) {
    //------------------get date-------------------//
    let rangeDate = req.body.rangeDate;
    if (rangeDate.length < 24) {
        // was not selected the date
        res.redirect("home-page/?firstName=" + userService.getUser().firstName);
        return;
    }
    startDateForGuest = new Date(
        parseInt(rangeDate.substring(0, 4)),
        parseInt(rangeDate.substring(5, 7)) - 1,
        parseInt(rangeDate.substring(8, 10))
    );
    endDateForGuest = new Date(
        parseInt(rangeDate.substring(14, 18)),
        parseInt(rangeDate.substring(19, 21)) - 1,
        parseInt(rangeDate.substring(22, 24))
    );

    //--------------- get room type -------------//
    let roomType_val = req.body.roomType;
    let roomType;
    if (roomType_val == 1) {
        roomType = "Single";
    } else if (roomType_val == 2) {
        roomType = "Double";
    } else {
        roomType = "Triple";
    }

    //-------------------------//

    getAllAvailableRooms(reservations, rooms, roomType).then(
        (allAvailableRooms) => {
            let roomsToShow = [];
            roomList.forEach(function (room) {
                if (
                    allAvailableRooms.find((element) => element === room.roomId) != null
                ) {
                    roomsToShow.push({
                        roomId: room.roomId,
                        roomType: room.type,
                        nrPerson: roomType_val,
                        price: room.price,
                    });
                }
            });
            res.redirect("find-option/?rooms=" + JSON.stringify(roomsToShow));
        }
    );
}

/**
 * Get a list of all rooms that are busy for that interval.
 * @param {*} allReservations - A list of all reservations from database
 * @returns array with all busy rooms (with roomId);
 */
async function getAllBusyRooms(allReservations) {
    var allBusyRooms = [];

    let reservationsList1 = await allReservations.find({
        startDate: { $gt: startDateForGuest, $lt: endDateForGuest },
    });

    if (reservationsList1 !== "undefined" && reservationsList1.length > 0) {
        console.log("Receive some room that are busy for that interval! (1)");
        reservationsList1.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    let reservationsList2 = await allReservations.find({
        endDate: { $gt: startDateForGuest, $lt: endDateForGuest },
    });
    if (reservationsList2 !== "undefined" && reservationsList2.length > 0) {
        console.log("Receive some room that are busy for that interval! (2)");
        reservationsList2.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    let reservationsList3 = await allReservations.find({
        startDate: { $lt: startDateForGuest },
        endDate: { $gt: endDateForGuest },
    });
    if (reservationsList3 !== "undefined" && reservationsList3.length > 0) {
        console.log("Receive some room that are busy for that interval! (3)");
        reservationsList3.forEach(function (reservation) {
            allBusyRooms.push(reservation.roomId);
        });
    }

    return allBusyRooms;
}

/**
 * Search in reservations all rooms that are available.
 * @param {*} allReservations  - list of all existing reservations
 * @param {*} allRooms - List of all rooms existing in the hotel
 * @param {*} roomType - Rooms Type selected by guest
 * @returns an array of roomId for all available rooms
 */
async function getAllAvailableRooms(allReservations, allRooms, roomType) {
    let allAvailableRooms = [];
    roomList = await allRooms.find();

    await getAllBusyRooms(allReservations).then((allBusyRooms) => {
        roomList.forEach(function (room) {
            if (
                allBusyRooms.find((element) => element === room.roomId) == null &&
                room.type === roomType
            ) {
                // not found in busy rooms + type is ok
                allAvailableRooms.push(room.roomId);
            }
        });
    });
    return allAvailableRooms;
}

/**
 * Add a selected room by guest to the reservation model from database.
 * @param {*} req - needed to get the room for which the guest made the reservation.
 * @param {*} res - needed to redirect to another page
 * @param {*} reservations - Reservation model from database
 */
function addReservation(req, res, reservations) {
    getNrReservations(reservations).then((nrReservations) => {
        const newReservation = new reservations({
            reservationId: nrReservations + 1,
            userId: userService.getUser().userId,
            roomId: req.body.reserveBtn,
            startDate: startDateForGuest,
            endDate: endDateForGuest,
        });
        newReservation.save(function (err) {
            if (err) {
                console.log(err);
                res.redirect("/find-option");
                return;
            } else {
                console.log("saved");
                res.redirect("home-page/?firstName=" + userService.getUser().firstName);
                return;
            }
        });
    });
}

/**
 * Get the number of reservations that already are in the database.
 * @param {*} reservations - Reservation model from database.
 * @returns the number of reservation.
 */
async function getNrReservations(reservations) {
    let nrReservations = (await reservations.find()).length;
    return nrReservations;
}

//------------------------------------------------------------//

/**
 * Redirect to my reservation page with all info about reservations that has the guest which is logged.
 * @param {*} res - needed to redirect to another page.
 * @param {*} reservations - reservation model from database, needed to extract the start date, end date, status.
 * @param {*} rooms - rooms model from databse, needed to extract the room type, number, etc
 */
function getAllReservationForUser(res, reservations, rooms) {

    getAllReservationToShowForUser(reservations, rooms).then((reservationToShow) => {
        res.redirect("my-reservations/?reservations=" + JSON.stringify(reservationToShow));
    });
}

/**
 * Get all reservations that a guest has.
 * @param {*} reservations - reservation model from database, needed to extract the start date, end date, status.
 * @param {*} rooms - rooms model from databse, needed to extract the room type, number, etc
 * @returns a vector with information about all reservation that has a guest.
 */
async function getAllReservationToShowForUser(reservations, rooms) {
    let reservationsList = await reservations.find({
        userId: userService.getUser().userId,
    });
    let roomList = await rooms.find();
    let reservationToShow = [];

    for (const reservation of reservationsList) {
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId) {

                let nrPers;
                if (room.type === "Single") {
                    nrPers = 1;
                } else if (room.type === "Double") {
                    nrPers = 2;
                } else {
                    nrPers = 3;
                }

                reservationToShow.push({
                    startDate: reservation.startDate,
                    endDate: reservation.endDate,
                    status: reservation.status,
                    roomNr: room.roomNumber,
                    roomType: room.type,
                    nrPersons: nrPers,
                });
                // break;
            }
        });
    }
    return reservationToShow;
}

//---------------------------------------//
function showAllReservationForAdmin(res, reservations, rooms, users) {

    getAllReservationToShowForAdmin(reservations, rooms, users).then((reservationToShow) => {
        res.redirect("reservations/?reservations=" + JSON.stringify(reservationToShow));
    });
}

async function getAllReservationToShowForAdmin(reservations, rooms, users) {
    console.log("reservations: " + reservations);
    let roomList = await rooms.find();
    let userList = await users.find();
    let reservationsList = await reservations.find();

    let reservationToShow = [];

    for (const reservation of reservationsList) {
        let roomNr;
        let roomType;
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId) {
                roomNr = room.roomNumber;
                roomType = room.type;
                // break;
            }
        });

        let guestFullName;
        userList.forEach(function (user) {
            if (user.userId == reservation.userId) {
                guestFullName = user.firstName + " " + user.lastName;
                // break;
            }
        });


        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: roomNr,
            roomType: roomType,
            guest: guestFullName
        });
    }
    return reservationToShow;
}

function showAllReservationByRoom(res, req, reservations, rooms, users) {

    getAllReservationByRoomNr(reservations, rooms, users, req.body.roomNumber).then((reservationToShow) => {
        res.redirect("reservations/?reservations=" + JSON.stringify(reservationToShow));
        console.log("reservation by room:" + reservationToShow.length);
    });
}

async function getAllReservationByRoomNr(reservations, rooms, users, roomNr) {
    console.log("getAllReservationByRoomNr: " + roomNr);
    let roomList = await rooms.find();
    let userList = await users.find();
    let reservationsList = await reservations.find();

    let reservationToShow = [];

    for (const reservation of reservationsList) {
        let should_add_reservation = false;
        let roomType;
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId && room.roomNumber == roomNr) {
                roomType = room.type;
                // break;
                should_add_reservation = true;
            }
        });

        if (!should_add_reservation)
        {
            continue;
        }

        let guestFullName;
        userList.forEach(function (user) {
            if (user.userId == reservation.userId) {
                guestFullName = user.firstName + " " + user.lastName;
                // break;
            }
        });
        console.log("roomType:" + roomType);

        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: roomNr,
            roomType: roomType,
            guest: guestFullName
        });
    }
    return reservationToShow;
}


function showAllReservationForInterval(res, req, reservations, rooms, users) {

    let rangeDate = req.body.rangeDate;
    if (rangeDate.length < 24) {
        // was not selected the date
        let reservationToShow = [];
        res.redirect("reservations/?reservations=" + JSON.stringify(reservationToShow));
        return;
    }
    let startDateAdmin = new Date(
        parseInt(rangeDate.substring(0, 4)),
        parseInt(rangeDate.substring(5, 7)) - 1,
        parseInt(rangeDate.substring(8, 10))
    );
    let endDateAdmin = new Date(
        parseInt(rangeDate.substring(14, 18)),
        parseInt(rangeDate.substring(19, 21)) - 1,
        parseInt(rangeDate.substring(22, 24))
    );

    getAllReservationFromInterval(reservations, rooms, users, startDateAdmin, endDateAdmin).then((reservationToShow) => {
        res.redirect("reservations/?reservations=" + JSON.stringify(reservationToShow));
    });
}

async function getAllReservationFromInterval(reservations, rooms, users, startDateAdmin, endDateAdmin) {

    let roomList = await rooms.find();
    let userList = await users.find();
    let reservationsList = await reservations.find({
        startDate: { $gt: startDateAdmin, $lt: endDateAdmin },
    });

    let reservationsList2 =await reservations.find({
        endDate: { $gt: startDateAdmin, $lt: endDateAdmin },
    });


    let reservationsList3 = await reservations.find({
        startDate: { $lt: startDateAdmin },
        endDate: { $gt: endDateAdmin },
    });

    let reservationToShow = [];

    for (const reservation of reservationsList) {
        let roomType;
        let roomNr;
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId) {
                roomType = room.type;
                roomNr = room.roomNumber;
                // break;
            }
        });

        let guestFullName;
        userList.forEach(function (user) {
            if (user.userId == reservation.userId) {
                guestFullName = user.firstName + " " + user.lastName;
                // break;
            }
        });


        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: roomNr,
            roomType: roomType,
            guest: guestFullName
        });
    }

    for (const reservation of reservationsList2) {
        let roomType;
        let roomNr;
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId) {
                roomType = room.type;
                roomNr = room.roomNumber;
                // break;
            }
        });

        let guestFullName;
        userList.forEach(function (user) {
            if (user.userId == reservation.userId) {
                guestFullName = user.firstName + " " + user.lastName;
                // break;
            }
        });


        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: roomNr,
            roomType: roomType,
            guest: guestFullName
        });
    }

    for (const reservation of reservationsList3) {
        let roomType;
        let roomNr;
        roomList.forEach(function (room) {
            if (room.roomId == reservation.roomId) {
                roomType = room.type;
                roomNr = room.roomNumber;
                // break;
            }
        });

        let guestFullName;
        userList.forEach(function (user) {
            if (user.userId == reservation.userId) {
                guestFullName = user.firstName + " " + user.lastName;
                // break;
            }
        });


        reservationToShow.push({
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            status: reservation.status,
            roomNr: roomNr,
            roomType: roomType,
            guest: guestFullName
        });
    }
    return reservationToShow;
}


/**
 * All methods that will be used in other files (public methods)
 */
module.exports = {
    getAllAvailableRoomsForInterval,
    addReservation,
    getAllReservationForUser,
    showAllReservationForAdmin,
    showAllReservationByRoom,
    showAllReservationForInterval
};
