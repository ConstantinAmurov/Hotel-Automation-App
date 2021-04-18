//take each check out button and verify if check in button is disabled
$("[id^=checkOutModalBtn]").each(function (ind, obj) {
  console.log(obj);
  console.log(obj.getAttribute("status"));
  if (obj.getAttribute("status") == 0 || obj.getAttribute("status") == 2) {
    $(obj).prop("disabled", true);
    $(obj).css({ opacity: 0.5 });
  } else if (obj.getAttribute("status") == 1) {
    $(obj).prop("disabled", false);
  }
});
