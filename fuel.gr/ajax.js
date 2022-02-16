//σύναρτηση αρχικοποίησης Ajax
function initAJAX() {
  if (window.XMLHttpRequest) {
    // υποστήριξη για IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    // υποστήριξη για IE6, IE5 (ActiveX object)
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else {
    //ενημέρωσε τον χρήστη οτι ο browser του είναι αρχαίος
    alert("Your browser does not support XMLHTTP!");
    return false;
  }
}
