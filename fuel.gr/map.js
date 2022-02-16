//αρχείο δημιουργίας χάρτη, των pin και των infobox κάθε pin

let map = L.map("map").setView([39.717076, 22.396285], 9);

//layer χάρτη OpenStreetMaps
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

//προσθήκη του layer OpenStreetMaps
osm.addTo(map);

//όταν γίνει αλλαγή καυσίμου διάγραψε τα markers(pin) και εμφάνισε τα καινούργια που αντιστοιχούν στο επιλεγμένο κάυσιμο
let select_fuel = document.getElementById("search_fuel");
select_fuel.addEventListener("change", () => {
  DeleteMarkers();
  GetStations();
});

//συνάρτηση λήψης δεδομένων πρατηρίων που έχουν το επιλεγμένο κάυσιμο και δημιουργία των pin και infobox στο καθένα
const GetStations = function GetGasStations() {
  let request = initAJAX();
  let fuel = document.getElementById("search_fuel").value;
  ShowGasCount(fuel);
  if (request) {
    // κλήση στο API
    url = "http://api.fuel.gr/gas_data?name=" + fuel;
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        let stations = JSON.parse(request.response);
        for (i = 0; i < stations.length; i++) {
          let station = stations[i];
          let stationMarker = L.marker(
            [station["gasStationLat"], station["gasStationLong"]],
            { autoPan: true }
          );
          let logo;
          //δημιουγία logo αναλόγως με την εταιρία
          if (station["fuelCompNormalName"] == "AVIN") {
            logo =
              "<img src='logos/avin.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "SHELL") {
            logo =
              "<img src='logos/shell.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "AEGEAN") {
            logo =
              "<img src='logos/aegean.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "EKO") {
            logo =
              "<img src='logos/eko.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "BP") {
            logo =
              "<img src='logos/bp.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "REVOIL") {
            logo =
              "<img src='logos/revoil.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "ΕΛΙΝΟΙΛ") {
            logo =
              "<img src='logos/elinoil.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "Α.Π.") {
            logo =
              "<img src='logos/ap.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "ΕΤΕΚΑ") {
            logo =
              "<img src='logos/eteka.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "JETOIL") {
            logo =
              "<img src='logos/jetoil.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "KAOIL") {
            logo =
              "<img src='logos/kaoil.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "ΤΡΙΑΙΝΑ") {
            logo =
              "<img src='logos/triaina.png' class='img-thumbnail' alt='logo' width='40px'>";
          } else if (station["fuelCompNormalName"] == "CYCLON") {
            logo =
              "<img src='logos/cyclon.png' class='img-thumbnail' alt='logo' width='40px'>";
          }
          let customOptions = {
            minWidth: "200",
            className: "custom",
          };
          // εαν ο χρήστης είναι συνδεμένος και δεν είναι πρατηριούχος
          //εμφάνισε το κουμπί για παραγγελία καυσίμου
          if (
            localStorage.getItem("jwt") !== null &&
            localStorage.getItem("stationID") == "false"
          ) {
            let popup = stationMarker.bindPopup(
              "<div class='fuelType' id='name'>" +
                station["fuelName"] +
                "</div>" +
                "<div class='gas_station_header'>" +
                "<div class='gas_station_brand'>" +
                logo +
                "&nbsp;" +
                "<span>" +
                station["fuelCompNormalName"] +
                "</span>" +
                "</div>" +
                "<div class='gas_station_price'>" +
                "<span id='fuel_price'>" +
                station["fuelPrice"] +
                "&euro;" +
                "</span>" +
                "</div>" +
                "</div>" +
                "<div class='gas_station_info'>" +
                "<div class='station_owner'>" +
                station["gasStationOwner"] +
                "</div>" +
                "<div class='station_address'>" +
                station["gasStationAddress"] +
                "</div>" +
                "</div>" +
                "<span id='popup_product_id' hidden>" +
                station["productID"] +
                "</span>" +
                "<button type='button' class='btn btn-success btn-sm w-100' onclick='showOrderGasModal()'>Παραγγελία Καυσίμου" +
                "</button>",
              customOptions
            );
            let markers = L.layerGroup([stationMarker]).addTo(map);
          } else {
            let popup = stationMarker.bindPopup(
              "<div class='fuelType' id='name'>" +
                station["fuelName"] +
                "</div>" +
                "<div class='gas_station_header'>" +
                "<div class='gas_station_brand'>" +
                logo +
                "&nbsp;" +
                "<span>" +
                station["fuelCompNormalName"] +
                "</span>" +
                "</div>" +
                "<div class='gas_station_price'>" +
                "<span id='fuel_price'>" +
                station["fuelPrice"] +
                "&euro;" +
                "</span>" +
                "</div>" +
                "</div>" +
                "<div class='gas_station_info'>" +
                "<div class='station_owner'>" +
                station["gasStationOwner"] +
                "</div>" +
                "<div class='station_address'>" +
                station["gasStationAddress"] +
                "</div>" +
                "</div>" +
                "<span id='popup_product_id' hidden>" +
                station["productID"] +
                "</span>",
              customOptions
            );
            let markers = L.layerGroup([stationMarker]).addTo(map);
          }
        }
      }
    };
  }
};

let gas_count = document.getElementById("gas_station_number");
let min_price = document.getElementById("Min_price");
let avg_price = document.getElementById("Avg_price");
let max_price = document.getElementById("Max_price");

//συνάρτηση λήψης του πλήθους πρατηρίων (ακέραιος), μέγιστη, ελάχιστη και μέση τιμή ανά lt ανάλογα
//με το επιλεγμένο καύσιμο
//και εμφάνισης τους στα παραπάνω στοιχεία
function ShowGasCount(fuel) {
  this.fuel = fuel;
  let request = initAJAX();

  if (request) {
    // κλήση στο API
    url = "http://api.fuel.gr/gas_count?name=" + fuel;
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        let gas_data = JSON.parse(request.response);
        for (i = 0; i < gas_data.length; i++) {
          let gas_data1 = gas_data[i];
          gas_count.innerHTML = gas_data1["gasStations"] + "&nbsp;";
          min_price.innerHTML = gas_data1["MinPrice"] + "&euro;";
          avg_price.innerHTML = gas_data1["AvgPrice"] + "&euro;";
          max_price.innerHTML = gas_data1["MaxPrice"] + "&euro;";
        }
      }
    };
  }
}

//συνάρτηση διαγραφής των marker
const DeleteMarkers = function DeleteMarkers() {
  //για κάθε layer(marker) που έχει ο χάρτης διαγραψέ το
  map.eachLayer(function (markers) {
    map.removeLayer(markers);
  });
  //εμφάνισε τον χάρτη χωρίς markers
  osm.addTo(map);
};
