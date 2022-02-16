//αρχείο διαχείρισης state στον client
let username;
let stationID;

//όταν φορτώσει η σελίδα αλλαξε το header ανάλογα με τον συνδεμένο χρήστη
//(το jwt το αποθήκευσα σε localstorage για ευκολία μαζί με το username και το stationID)
//(το stationID θα είναι νουμερο εαν υπάρχει αλλιώς θα έιναι false)
//το jwt το στέλνω στο header για κάθε κλήση στο API(modal.js)

window.onload = function () {
  // απλός χρήστης
  if (
    localStorage.getItem("jwt") !== null &&
    localStorage.getItem("stationID") == "false"
  ) {
    username = localStorage.getItem("username");
    let navbar = document.getElementById("navbarNav");
    navbar.innerHTML += `
    <ul class="navbar-nav">
      <li class="nav-item m-2 d-md-inline">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-person-square" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
        </svg>
      </li>
      <li class="nav-item m-2 d-md-inline">
        <a class="nav-link disabled text-white" href="#">${username}</a>
      </li>
      <li class="nav-item m-2 d-md-inline">
        <button class="btn btn-danger" id="logoutbtn">Αποσύνδεση</button>
      </li>
    </ul>`;
    logoutbtn = document.getElementById("logoutbtn");
    logoutbtn.addEventListener("click", showLogoutModal);
    GetStations();
  } else if (
    localStorage.getItem("jwt") !== null &&
    isNaN(localStorage.getItem("stationID")) == false
  ) {
    //ιδιοκτήτης πρατηρίου
    username = localStorage.getItem("username");
    stationID = localStorage.getItem("stationID");
    let navbar = document.getElementById("navbarNav");
    navbar.innerHTML += `
      <ul class="navbar-nav">
        <li class="nav-item m-2 d-md-inline">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-person-square" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
          </svg>
        </li>
        <li class="nav-item m-2 d-md-inline">
          <a class="nav-link disabled text-white" href="#">${username}</a>
        </li>
        <li class="nav-item m-2 d-md-inline">
          <button class="btn btn-primary" id="station_order_btn">Παραγγελίες</button>
        </li>
        <li class="nav-item m-2 d-md-inline">
          <button class="btn btn-primary" id="station_price_btn">Αλλαγή Τιμών</button>
        </li>
        <li class="nav-item m-2 d-md-inline">
          <button class="btn btn-danger" id="logout_btn">Αποσύνδεση</button>
        </li>
      </ul>`;
    station_order_btn = document.getElementById("station_order_btn");
    station_order_btn.addEventListener("click", showOrderModal);
    station_price_btn = document.getElementById("station_price_btn");
    station_price_btn.addEventListener("click", showStationPriceModal);
    logout_btn = document.getElementById("logout_btn");
    logout_btn.addEventListener("click", showLogoutModal);
    GetStations();
  } else if (
    localStorage.getItem("jwt") == null &&
    localStorage.getItem("stationID") == null
  ) {
    //χρήστης που δεν έχει συνδεθεί
    let navbar = document.getElementById("navbarNav");
    navbar.innerHTML += `
    <ul class="navbar-nav">
      <li class="nav-item m-2 d-md-inline">
        <button class="btn btn-success" id="loginbtn">Σύνδεση</button>
      </li>
    </ul>`;
    login_btn = document.getElementById("loginbtn");
    login_btn.addEventListener("click", showLoginModal);
    GetStations();
  }
};

//συνάρτηση σύνδεσης του χρήστη
function Login(username, password) {
  let request = initAJAX();
  if (request) {
    url = "http://api.fuel.gr/login?user=" + username + "&pass=" + password;
    request.open("POST", url, true);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        let response = JSON.parse(request.response);
        let jwt = response["token"];
        let username = response["username"];
        let stationID = response["stationID"];
        localStorage.setItem("jwt", `${jwt}`);
        localStorage.setItem("username", `${username}`);
        localStorage.setItem("stationID", `${stationID}`);
        window.location.reload(true);
      } else if (request.readyState == 4 && request.status == 401) {
        let response = JSON.parse(request.response);
        let error = response["error"];
        let login_error = document.getElementById("login_error");
        login_error.innerHTML = `<div class="alert alert-danger alert-dismissible d-flex align-items-center fade show">
      	      <i class="bi-exclamation-octagon-fill"></i>
              <strong class="mx-2">${error}</strong>
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
      }
    };
  }
}

//συνάρτηση αποσύνδεσης
function Logout() {
  localStorage.clear();
  window.location.reload(true);
}
