/**
 * Used to save info about user that is connected.
 * We identify user in loginRequest, but we also need it in securityCodeRequest.
 */
var user;

/**
 * Will use to get the all rooms, for admin
 */
const roomService = require("./processRoomManagement");


// ------------- methods --------------- //

/**
 * Used to perform login request.
 * @param {*} req - needed to extract the username and pass
 * @param {*} res - to redirect to another page
 * @param {*} users  - all users from database.
 */
async function loginRequest(req, res, users) {
    var _username = req.body.username;
    var _password = req.body.password;

    // username in unique, so we will get one or zero user.

    let _user = await users.findOne({ username: _username });
    if (_user != null && _user.password === _password) {
        console.log("User and pass exist!");
        user = _user;
        // should check the role
        checkRole(res);
        return true;
    }
    else {
        console.log("Not such user or pass!");
        res.render("login");
        return false;
    }
}

/**
 *  Used to render the page based on user role
 * @param {*} res - needed to redirect to another page based on role
 */
function checkRole(res) {
    if (user.role === 0) {
        // is admin
        res.redirect("security-code");
        return;
    }
    if (user.role === 1) {
        // is cleaning staff
        // page that cleaning staff have no access to the web app
        return;
    }
    res.redirect("home-page/?firstName=" + user.firstName);
    return;
}

/**
 * Used to verify the security code for staff.
 * @param {*} req - needed to get the security code
 * @param {*} res - needed to redirect to another page.
 * @param {*} rooms - rooms model from database
 * @returns 
 */
function securityCodeRequest(req, res, rooms) {
    var _securityCode = req.body.securityKey;

    if (user.securityCode == _securityCode) {
        // is admin
        roomService.getAllRooms(rooms).then((roomsToShow) => {
            res.redirect("rooms/?rooms=" + JSON.stringify(roomsToShow));
        });
        return;
    }

    console.log("security code is not correct!");
    res.redirect("security-code");
}

/**
 * 
 * @returns the user;
 */
function getUser() {
    return user;
}

/**
 * All public methods, that are accesible from other files.
 */
module.exports = {
    loginRequest,
    securityCodeRequest,
    getUser
};
