/**
 * Add new room to databse
 * @param {*} req - needed to get the info about room
 * @param {*} res - need to redirect to another page (with updated rooms)
 * @param {*} rooms - rooms model from databse
 */
function addNewRoom(req, res, rooms) {
    getNrRooms(rooms).then((nrRooms) => {
        const newRoom = new rooms({
            roomId: nrRooms + 1,
            roomNumber: req.body.roomNr,
            type: req.body.roomType,
            price: req.body.roomPrice,
            facilities: "needToBeAdded"
        });
        newRoom.save(function (err) {
            if (err) {
                console.log(err);
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
                return;
            } else {
                console.log("saved");
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
                return;
            }
        });
    });
}

/**
 * Get the number of rooms that are already in database
 * @param {*} rooms - rooms model rom databse
 * @returns - the number of rooms
 */
async function getNrRooms(rooms) {
    let nrRooms = (await rooms.find()).length;
    return nrRooms;
}

/**
 * Get infor from databse about all rooms
 * @param {*} rooms - rooms model from databse
 * @returns A vector with all existing rooms.
 */
async function getAllRooms(rooms) {
    let roomList = await rooms.find();
    let roomsToShow = [];

    roomList.forEach(function (room) {
        roomsToShow.push({
            roomId: room.roomId,
            roomNr: room.roomNumber,
            roomType: room.type,
            price: room.price,
            facilities: room.facilities,
        });
    });
    return roomsToShow;
}

/**
 * Update info about one room
 * @param {*} req - needed to get the info about room which we update
 * @param {*} res - needed to redirect to another page.
 * @param {*} rooms - rooms model from database.
 */
function updateRoom(req, res, rooms) {
    let query = { roomNumber: req.body.roomNumer };

    rooms.findOneAndUpdate(query,
        {
            price: req.body.price,
            facilities: req.body.facilities,
        },
        function (err, doc) {
            if (err) {
                console.log("[ERROR:updateRoom]=" + err);
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
            }
            else {
                getAllRooms(rooms).then((roomsToShow) => {
                    res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
                });
            }
        });
}

/**
 * Delete one selected room from database
 * @param {*} req - needed to access the room which should be deleted.
 * @param {*} res - needed to redirect to another page.
 * @param {*} rooms - rooms model from database
 */
function deleteRoom(req, res, rooms) {
    rooms.findByIdAndDelete({ roomNumber: req.body.roomNumber }, function (err) {
        if (err) {
            console.log("[ERROR:updateRoom]=" + err);
            getAllRooms(rooms).then((roomsToShow) => {
                res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
            });
        }
        else {
            getAllRooms(rooms).then((roomsToShow) => {
                res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
            });
        }
    });
}

/**
 * All public methods, that are visible from other files.
 */
module.exports = {
    addNewRoom,
    updateRoom,
    deleteRoom,
    getAllRooms
};