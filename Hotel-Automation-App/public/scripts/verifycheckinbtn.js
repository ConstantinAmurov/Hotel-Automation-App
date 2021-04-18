//declare today's date
var q = new Date();
var m = q.getMonth();
var d = q.getDay();
var y = q.getFullYear();

var today = new Date(y, m, d);

$("#start-date > p").each(function (ind, obj) {
  myDate = new Date(obj.innerHTML);
  if (today > myDate || today === myDate) {
    $("#checkInModalBtn" + ind).prop("enabled", true);
  } else {
    console.log("today's date is smaller");
    $("#checkInModalBtn" + ind).prop("disabled", true);
    $("#checkInModalBtn" + ind).css({ opacity: 0.5 });
  }
});

//take each check out button and verify if check in button is disabled
// $("[id^=checkInModalBtn]").each(function (ind, obj) {
//   console.log(obj);
//   console.log(obj.getAttribute("status"));
//   if (obj.getAttribute("status") == 0 || obj.getAttribute("status") == 2) {
//     $(obj).prop("disabled", true);
//     $(obj).css({ opacity: 0.5 });
//   } else if (obj.getAttribute("status") == 1) {
//     $(obj).prop("disabled", false);
//   }
// });
