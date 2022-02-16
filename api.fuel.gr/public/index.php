<?php

use Firebase\JWT\JWT;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';
require __DIR__ . '/../src/CorsMiddleware.php';

$app = AppFactory::create();

//middleware για authentication
//στο path βάζω τα routes που θα έλενχούν
$app->add(new Tuupola\Middleware\JwtAuthentication([
    "path" => ["/station_orders", "/order", "/change/gas_price", "/remove/order"],
    "secure" => false,
    "secret" => "qwertyuiopasdfghjklzxcvbnm123456",
    "algorithm" => "HS256",
    "error" => function ($response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];
        return $response
            ->withHeader("Content-Type", "application/json")
            ->getBody()->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    },
]));

//χρήση του cors middleware για αποφυγή cors error
//εμπνευσμένο από το slim documentation
$app->add(CorsMiddleware::class);

//επιτροπή preflight request δηλαδή request για αποστολή
//authentication header

// Επιτροπή preflight requests για /station_orders
$app->options('/station_orders', function (
    Request $request,
    Response $response
): Response {
    return $response;
});

// Επιτροπή preflight requests για /order
$app->options('/order', function (
    Request $request,
    Response $response
): Response {
    return $response;
});

// Επιτροπή preflight requests για /change/gas_price
$app->options('/change/gas_price', function (
    Request $request,
    Response $response
): Response {
    return $response;
});

// Επιτροπή preflight requests για /remove/order
$app->options('/remove/order', function (
    Request $request,
    Response $response
): Response {
    return $response;
});

$app->addRoutingMiddleware();

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

//1. GET: Λήψη δεδομένων πρατηρίων και τιμών επιλεγμένου καυσίμου
//πχ url: http://api.fuel.gr/gas_data?name=Αμόλυβδη 95

$app->get('/gas_data', function (Request $request, Response $response, array $args) {
    $name = $request->getQueryParams()['name'];
    $sql = "SELECT g.gasStationID,gasStationLat,gasStationLong,fuelCompNormalName,gasStationOwner,gasStationAddress,productID,fuelNormalName,fuelName,fuelPrice FROM (SELECT * FROM pricedata WHERE FuelNormalName = '$name') AS p INNER JOIN gasstations AS g ON g.gasStationID=p.gasStationID";
    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->query($sql);
        $pricedata = $stmt->fetchAll(PDO::FETCH_OBJ);

        $db = null;
        $response->getBody()->write(json_encode($pricedata));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );

        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);
    }
});

//2. GET: Πλήθος πρατηρίων (ακέραιος), μέγιστη, ελάχιστη και μέση τιμή ανά lt (με 3 δεκαδικά).
//πχ url: http://api.fuel.gr/gas_count?name=Αμόλυβδη 95

$app->get('/gas_count', function (Request $request, Response $response, array $args) {
    $name = $request->getQueryParams()['name'];
    $sql = "SELECT COUNT(DISTINCT gasStationID) AS gasStations, ROUND(MAX(fuelPrice),3) AS MaxPrice,ROUND(MIN(fuelPrice),3) AS MinPrice,ROUND(AVG(fuelPrice),3) AS AvgPrice FROM pricedata WHERE FuelNormalName = '$name'";
    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->query($sql);
        $pricedata = $stmt->fetchAll(PDO::FETCH_OBJ);

        $db = null;
        $response->getBody()->write(json_encode($pricedata));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );

        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);

    }
});

//GET: Λήψη τιμοκαταλόγου ενός πρατηρίου
//πχ url: http://api.fuel.gr/station_prices?id=441

$app->get('/station_prices', function (Request $request, Response $response, array $args) {
    $id = $request->getQueryParams()['id'];
    $sql = "SELECT fuelName,fuelPrice,dateUpdated,isPremium FROM pricedata WHERE gasStationID = $id";
    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->query($sql);
        $station_prices = $stmt->fetchAll(PDO::FETCH_OBJ);

        $db = null;
        $response->getBody()->write(json_encode($station_prices));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );

        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);

    }
});

// GET: Λήψη παραγγελιών πρατηρίου
//πχ url: http://api.fuel.gr/station_orders?id=441

$app->get('/station_orders', function (Request $request, Response $response, array $args) {
    $gasStationID = $request->getQueryParams()['id'];
    $sql = "SELECT orderID,username,fuelName,quantity,o.when FROM orders AS o JOIN (SELECT * FROM pricedata WHERE gasStationID = '$gasStationID') AS p ON p.productID=o.productID";
    try {
        $db = new DB();
        $conn = $db->connect();
        $stmt = $conn->query($sql);
        $orders = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        $response->getBody()->write(json_encode($orders));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );
        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);
    }
});

// POST: LogIn χρήστη (η database έχει ήδη χρήστες).
//πχ url: http://api.fuel.gr/login?user=user1&pass=pass1

$app->post('/login', function (Request $request, Response $response, $args) {
    $username = $request->getQueryParams()['user'];
    $password = $request->getQueryParams()['pass'];
    $sql = "SELECT username,password FROM users WHERE username='$username' AND password='$password'";
    $db = new DB();
    $conn = $db->connect();
    $stmt = $conn->query($sql);
    $login = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    if ($login) {
        //login και δημιουργία jwt token
        $sql = "SELECT gasStationID FROM gasstations WHERE username='$username'";
        $db = new DB();
        $conn = $db->connect();
        $stmt = $conn->query($sql);
        $stationID = $stmt->fetch(PDO::FETCH_OBJ);
        //εαν είναι ιδιοκτήτης πρατηρίου
        if ($stationID !== false) {
            $stationID = $stationID->gasStationID;
        }
        $db = null;
        $secret = 'qwertyuiopasdfghjklzxcvbnm123456';
        $now = new DateTime();
        $payload = [
            "iss" => "api.fuel.gr",
            "iat" => $now->getTimeStamp(),
            "username" => "$username",
            "stationID" => "$stationID",
        ];
        $token = JWT::encode($payload, $secret, "HS256");
        //δημουργώ ενα array δεδομένων για να τα χρησιμοποιήσω για την διαχείρηση state στον client
        $array = array('token' => $token, 'username' => $username, 'stationID' => $stationID);
        $response->getBody()->write(json_encode($array, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        return $response
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200);
    }
    $error = ['error' => 'Λάθος όνομα χρήστη ή κωδικός πρόσβασης!'];
    $response->getBody()->write(json_encode($error, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withStatus(401);
});

//POST: Αποστολή δεδομένων παραγγελίας από πλευράς χρήστη (ποσότητα).
//πχ url: http://api.fuel.gr/order?productID=3&user=user1&quantity=1

$app->post('/order', function (Request $request, Response $response, $args) {
    $product_id = $request->getQueryParams()['productID'];
    $username = $request->getQueryParams()['user'];
    $quantity = $request->getQueryParams()['quantity'];
    $sql = 'INSERT INTO orders (productID,username,quantity) VALUES (:productID, :username, :quantity)';
    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->prepare($sql);

        $result = $stmt->execute(array(':productID' => $product_id, ':username' => $username, ':quantity' => $quantity));
        $db = null;
        $response->getBody()->write(json_encode($result));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );

        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);

    }
});

//PUT: Αλλαγή τιμής σε καύσιμο
//πχ url: http://api.fuel.gr/change/gas_price?stationID=441&fuelName=Αμόλυβδη AVIN Best 95&price=1.379

$app->put('/change/gas_price', function (Request $request, Response $response, $args) {
    $gasStationID = $request->getQueryParams()['stationID'];
    $fuelName = $request->getQueryParams()['fuelName'];
    $fuelprice = $request->getQueryParams()['price'];
    $sql = 'UPDATE pricedata SET fuelPrice=:fuelPrice WHERE (gasStationID=:gasStationID AND fuelName=:fuelName)';

    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->prepare($sql);
        $result = $stmt->execute(array(':fuelPrice' => $fuelprice, ':gasStationID' => $gasStationID, ':fuelName' => $fuelName));
        $db = null;
        $response->getBody()->write(json_encode($result));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );
        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);
    }
});

//DELETE: Διαγραφή παραγγελίας από πρατηριούχο.
//πχ url: http://api.fuel.gr/remove/order?orderID=3

$app->delete('/remove/order', function (Request $request, Response $response, $args) {
    $orderID = $request->getQueryParams()['orderID'];
    $sql = 'DELETE FROM orders WHERE (orderID=:orderID)';

    try {
        $db = new DB();
        $conn = $db->connect();

        $stmt = $conn->prepare($sql);
        $result = $stmt->execute(array(':orderID' => $orderID));
        $db = null;
        $response->getBody()->write(json_encode($result));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(200);
    } catch (PDOException $e) {
        $error = array(
            "message" => $e->getMessage(),
        );

        $response->getBody()->write(json_encode($error));
        return $response
            ->withHeader('content-type', 'application/json')
            ->withStatus(500);

    }
});

$app->run();
