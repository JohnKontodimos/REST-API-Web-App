//αρχείο εμφάνισης δυναμικών modal παραθύρων

//εδω εμφανίζονται τα modal δυναμικά με javascript
//καθώς και γίνονται οι κλήσεις AJAX σε κάθε modal
//για την δυναμική εμφάνιση των modal και των δεδομένων τους
//χρησιμοπιοώ localstorage για το jwt,username και stationID

var modalWrap = null;

const showLoginModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }

  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="loginModalLabel">Σύνδεση</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div id="login_error"></div>
            <form>
              <div class="mb-3">
                <label class="form-label">Όνομα Χρήστη:</label>
                <input type="text" class="form-control" id="Login_Username">
              </div>
              <div class="mb-3">
                <label class="form-label">Κωδικός Πρόσβασης:</label>
                <input type="password" id="Login_Password" class="form-control" autocomplete="on">
              </div>
            </form>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-success modal-success-btn" id="login_submit">Σύνδεση</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Κλείσιμο</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  let login_btn = document.getElementById("login_submit");
  login_btn.addEventListener("click", () => {
    let password = document.getElementById("Login_Password").value;
    let username = document.getElementById("Login_Username").value;
    Login(username, password);
  });
};

const showLogoutModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }

  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Αποσύνδεση</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Θέλετε να αποσυνδεθείτε;
        </div>
        <div class="modal-footer bg-light" id="footer">
          <button type="button" class="btn btn-primary modal-success-btn" data-bs-dismiss="modal" id="logout_btn">Ναι</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Όχι</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  let logout_btn = document.querySelector("#footer>#logout_btn");
  logout_btn.addEventListener("click", () => {
    Logout();
  });
};

const showOrderModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Παραγγελίες</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="order_table_modal"></div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Κλείσιμο</button>
        </div>
      </div>
    </div>
    </div>
  `;

  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  ShowOrders();
};

const showOrderDeleteModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Θέλετε να διαγράψετε την παρακάτω παραγγελία;</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
                <div>Κωδικός Παραγγελίας:&nbsp;<span id="order_id"></span></div>
            </div>
            <div class="mb-3">
              <div>Χρήστης:&nbsp;<span id="order_username"></span></div>
            </div>
            <div class="mb-3">
              <div>Καύσιμο:&nbsp;<span id="order_fuelName"></span></div>
            </div>
            <div class="mb-3">
              <div>Ποσότητα:&nbsp;<span id="order_quantity"></span></div>
            </div>
            <div class="mb-3">
              <div>Ημ/νια και 'Ωρα Καταχώρησης:&nbsp;<span id="order_when"></span></div>
            </div>
          </div>
        <div class="modal-footer bg-light">
          <button type="submit" class="btn btn-success modal-success-btn" data-bs-dismiss="modal" onclick="DeleteOrder()">Διαγραφή</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="showOrderModal()">Άκυρο</button>
        </div>
      </div>
    </div>
    </div>
  `;

  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  let orderID = localStorage.getItem("orderID");
  document.getElementById("order_id").textContent = orderID;
  let username = localStorage.getItem("username");
  document.getElementById("order_username").textContent = username;
  let fuelName = localStorage.getItem("fuelName");
  document.getElementById("order_fuelName").textContent = fuelName;
  let quantity = localStorage.getItem("quantity");
  document.getElementById("order_quantity").textContent = quantity + " " + "lt";
  let when = localStorage.getItem("when");
  document.getElementById("order_when").textContent = when;
};

function PassOrderData(orderID, username, fuelName, quantity, when) {
  var orderID = orderID;
  localStorage.setItem("orderID", `${orderID}`);
  var username = username;
  localStorage.setItem("username", `${username}`);
  var fuelName = fuelName;
  localStorage.setItem("fuelName", `${fuelName}`);
  var quantity = quantity;
  localStorage.setItem("quantity", `${quantity}`);
  var when = when;
  localStorage.setItem("when", `${when}`);
  showOrderDeleteModal();
}

function ShowOrders() {
  let request = initAJAX();
  if (request) {
    //κλήση στο API με το jwt στο Header
    url = "http://api.fuel.gr/station_orders?id=" + stationID;
    let jwt = localStorage.getItem("jwt");
    request.open("GET", url, true);
    request.setRequestHeader("Authorization", "Bearer" + " " + jwt);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        document.getElementById(
          "order_table_modal"
        ).innerHTML += `<table class="table table-bordered table-hover" id="order_table"><thead><tr class="table-dark"><th scope="col">Κωδικός</th><th scope="col">Όνομα</th><th scope="col">Καύσιμο</th><th scope="col">Ποσότητα</th><th scope="col">Πότε Καταχωρήθηκε</th><th scope="col"></th></tr></thead><tbody></tbody></table>`;
        const order_tableBody = document.querySelector("#order_table > tbody");
        let orders = JSON.parse(request.response);
        for (i = 0; i < orders.length; i++) {
          let order = orders[i];
          const tr = document.createElement("tr");
          const td_order_id = document.createElement("td");
          td_order_id.textContent = order["orderID"];
          let orderID = order["orderID"];
          tr.appendChild(td_order_id);
          const td_username = document.createElement("td");
          td_username.textContent = order["username"];
          let username = order["username"];
          tr.appendChild(td_username);
          const td_fuelname = document.createElement("td");
          td_fuelname.textContent = order["fuelName"];
          let fuelName = order["fuelName"];
          tr.appendChild(td_fuelname);
          const td_quantity = document.createElement("td");
          td_quantity.innerHTML = order["quantity"] + "&nbsp;" + "lt";
          let quantity = order["quantity"];
          tr.appendChild(td_quantity);
          const td_when = document.createElement("td");
          td_when.textContent = order["when"];
          let when = order["when"];
          tr.appendChild(td_when);
          const td_delete_order_btn = document.createElement("td");
          td_delete_order_btn.innerHTML = `<button class="btn btn-danger" data-bs-dismiss="modal" onclick="PassOrderData('${orderID}','${username}','${fuelName}','${quantity}','${when}')">Διαγραφή Παραγγελίας</button>`;
          tr.appendChild(td_delete_order_btn);
          order_tableBody.appendChild(tr);
        }
      }
    };
  }
}

function DeleteOrder() {
  let orderID = document.getElementById("order_id").textContent;
  let request = initAJAX();
  if (request) {
    //κλήση στο API με το jwt στο Header
    url = "http://api.fuel.gr/remove/order?orderID=" + orderID;
    let jwt = localStorage.getItem("jwt");
    request.open("DELETE", url, true);
    request.setRequestHeader("Authorization", "Bearer" + " " + jwt);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        showOrderModal();
      } else if (request.readyState == 4 && request.status == 401) {
        let error = "Δεν είστε διαπιστευμένος!!";
        showErrorModal(error);
      }
    };
  }
}

const showStationPriceModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }

  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Αλλαγή τιμών</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div id="price_message"></div>
          <div class="modal-body" id="price_table_modal"></div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Κλείσιμο</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  ShowPrices();
};

const showStationPriceChangeModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Αλλαγή τιμής</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" >
            <div id="change_modal_msg"></div>
            <form id="change_price_form">
                <div class="mb-3">
                  <label class="form-label">Όνομα Καυσίμου:&nbsp;<span id="change_fuel_name"></span></label>
                </div>
                <div class="mb-3">
                  <label class="form-label">Προηγούμενη τιμή:&nbsp;<span id="previous_price"></span></label>
                </div>
                <div class="input-group mb-3 align-items-center">
                  <label for="new_price" class="form-label">Νέα Τιμή:&nbsp;</label>
                  <input type="number" step="0.001" class="form-control" id="new_price" required>
                  <span class="input-group-text">€</span>
                </div>
            </form>
          </div>
        <div class="modal-footer bg-light">
          <button type="submit" class="btn btn-success modal-success-btn" data-bs-dismiss="modal" onclick="ChangePrice()">Αλλαγή Τιμής</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onclick="showStationPriceModal()">Άκυρο</button>
        </div>
      </div>
    </div>
    </div>
  `;

  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  let fuelName = localStorage.getItem("fuelName");
  document.getElementById("change_fuel_name").textContent = fuelName;
  let previous_price = localStorage.getItem("previous_price");
  document.getElementById("previous_price").innerHTML =
    previous_price + "&euro;";
  document.getElementById("new_price").value = previous_price;
};

function ShowPrices() {
  let request = initAJAX();
  if (request) {
    url = "http://api.fuel.gr/station_prices?id=" + stationID;
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        document.getElementById(
          "price_table_modal"
        ).innerHTML += `<table class="table table-bordered table-hover" id="price_table"><thead><tr class="table-dark"><th scope="col">Καύσιμο</th><th scope="col">Τιμή</th><th scope="col">Είναι Premium;</th><th scope="col">Τελευταία Τροποποίηση</th><th scope="col"></th></tr></thead><tbody></tbody></table>`;
        const price_tableBody = document.querySelector("#price_table > tbody");
        let prices = JSON.parse(request.response);
        for (i = 0; i < prices.length; i++) {
          let price = prices[i];
          const tr = document.createElement("tr");
          const td_fuelname = document.createElement("td");
          td_fuelname.textContent = price["fuelName"];
          fuelName = td_fuelname.textContent;
          tr.appendChild(td_fuelname);
          const td_price = document.createElement("td");
          td_price.innerHTML = price["fuelPrice"] + "&nbsp;" + "&euro;";
          previous_price = price["fuelPrice"];
          tr.appendChild(td_price);
          const td_premium = document.createElement("td");
          if (price["isPremium"] == 0) {
            td_premium.textContent = "Όχι";
          } else {
            td_premium.textContent = "Ναι";
          }
          tr.appendChild(td_premium);
          const td_when = document.createElement("td");
          td_when.textContent = price["dateUpdated"];
          tr.appendChild(td_when);
          const td_change_price_btn = document.createElement("td");
          td_change_price_btn.innerHTML = `<button class="btn btn-primary" data-bs-dismiss="modal" onclick="PassPriceData('${fuelName}','${previous_price}')">Αλλαγή Τιμής</button>`;
          tr.appendChild(td_change_price_btn);
          price_tableBody.appendChild(tr);
        }
      }
    };
  }
}

function PassPriceData(fuelName, previous_price) {
  var fuelName = fuelName;
  localStorage.setItem("fuelName", `${fuelName}`);
  var previous_price = previous_price;
  localStorage.setItem("previous_price", `${previous_price}`);
  showStationPriceChangeModal();
}

function ChangePrice() {
  let fuelName = document.getElementById("change_fuel_name").textContent;
  let price = document.getElementById("new_price").value;
  let request = initAJAX();
  if (request) {
    //κλήση στο API με το jwt στο Header
    url =
      "http://api.fuel.gr/change/gas_price?stationID=" +
      stationID +
      "&fuelName=" +
      fuelName +
      "&price=" +
      price;
    let jwt = localStorage.getItem("jwt");
    request.open("PUT", url, true);
    request.setRequestHeader("Authorization", "Bearer" + " " + jwt);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        showStationPriceModal();
      } else if (request.readyState == 4 && request.status == 401) {
        let error = "Δεν είστε διαπιστευμένος!!";
        showErrorModal(error);
      }
    };
  }
}

const showOrderGasModal = () => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Παραγγελία Καυσίμου</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" >
            <div id="change_modal_msg"></div>
            <form id="change_price_form">
                <div class="mb-3">
                  <label class="form-label">Όνομα Καυσίμου:&nbsp;<span id="order_fuel_name"></span></label>
                </div>
                <div class="mb-3">
                  <label class="form-label">Τιμή ανα λίτρο:&nbsp;<span id="order_price"></span></label>
                </div>
                <span id="order_product_id" hidden></span>
                <div class="input-group mb-3 align-items-center">
                  <label for="order_quantity" class="form-label">Λίτρα:&nbsp;</label>
                  <input type="number" class="form-control" step="1" id="order_quantity" value="1" min="1" required>
                  <span class="input-group-text">lt</span>
                </div>
            </form>
          </div>
        <div class="modal-footer bg-light">
          <button type="submit" class="btn btn-success modal-success-btn" data-bs-dismiss="modal" onclick="MakeOrder()">Παραγγελία</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Άκυρο</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
  let product_id = document.getElementById("popup_product_id").textContent;
  let fuelName = document.getElementById("name").textContent;
  let price = document.getElementById("fuel_price").textContent;
  document.getElementById("order_fuel_name").textContent = fuelName;
  document.getElementById("order_price").textContent = price;
  document.getElementById("order_product_id").textContent = product_id;
};

function MakeOrder() {
  let productID = document.getElementById("order_product_id").textContent;
  let order_quantity = document.getElementById("order_quantity").value;
  let request = initAJAX();
  if (request) {
    //κλήση στο API με το jwt στο Header
    let jwt = localStorage.getItem("jwt");
    let username = localStorage.getItem("username");
    url =
      "http://api.fuel.gr/order?productID=" +
      productID +
      "&user=" +
      username +
      "&quantity=" +
      order_quantity;
    request.open("POST", url, true);
    request.setRequestHeader("Authorization", "Bearer" + " " + jwt);
    request.send();
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        let success = "Η παραγγελία σας έγινε επιτυχώς";
        showSuccessModal(success);
      } else if (request.readyState == 4 && request.status == 401) {
        let error = "Δεν είστε διαπιστευμένος!!";
        showErrorModal(error);
      }
    };
  }
}

const showErrorModal = (error) => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Σφάλμα!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger alert-dismissible d-flex align-items-center fade show">
      	      <i class="bi-exclamation-octagon-fill"></i>
              <strong class="mx-2">${error}</strong></div>
          </div>
        <div class="modal-footer bg-light" id="footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
};

const showSuccessModal = (success) => {
  if (modalWrap !== null) {
    modalWrap.remove();
  }
  modalWrap = document.createElement("div");
  modalWrap.innerHTML = `
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title" id="logoutModalLabel">Επιτυχία</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-success alert-dismissible d-flex align-items-center fade show">
      	      <i class="bi-check-circle-fill"></i>
              <strong class="mx-2">${success}</strong>
            </div>
          </div>
        <div class="modal-footer bg-light" id="footer">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
        </div>
      </div>
    </div>
    </div>
  `;
  document.body.append(modalWrap);
  var modal = new bootstrap.Modal(modalWrap.querySelector(".modal"));
  modal.show();
};
