## Κατασκευή απλου REST API και Web Εφαρμογής

Εργασία που κατασκευάστηκε στα πλαίσια διδασκαλίας προγραμματισμού διαδικτύου στη σχολή μου. 

## Περιεχόμενα

* [Σχετικά](#σχετικά)
* [Τι έμαθα](#τι-έμαθα)
* [Τεχνολογίες που χρησιμοποιήθηκαν](#τεχνολογίες-που-χρησιμοποιήθηκαν)
* [Λειτουργίες](#λειτουργίες)
* [Κλήσεις Rest API](#κλήσεις-rest-api)
* [Οδηγίες Εγκατάστασης](#οδηγίες-εγκατάστασης)
* [Άδεια](#άδεια)
* [Συγγραφέας](#συγγραφέας)

## Σχετικά

Η εργασία αυτή αποτελεί μικρoγραφία του [fuelgr](https://fuelgr.gr/web/) και είναι εμπνευσμένη απο αυτό. 

Αντικείμενο της εργασίας είναι η δημιουργία μιας αλληλεπιδραστικής web εφαρμογής που τροφοδοτείται με δεδομένα μέσω ενός REST API.

Σε αυτή την εφαρμογή ο χρήστης μπορεί να βρεί το καύσιμο που επιθυμεί στην καλύτερη τιμή από τον χάρτη. Όλα τα δεδομένα της εφαρμογής λαμβάνονται με AJAX η οποία κάνει κλήσεις στο REST API. 

Το project αποτελείται από δύο φακέλους, ένας φάκελος περιέχει το API (api.fuel.gr) και ένας ακόμα έχει τα αρχεία του site (fuel.gr). Επίσης συμπεριλαμβάνω και αρχείo SQL με export την db (schema και data).

## Τι έμαθα

- Να υλοποίω και να χρησιμοποιώ REST API
- Να χρησιμοποιώ κάποιο PHP framework (Slim)
- Nα χρησιμοποιώ Leaflet JS και OpenStreetMaps
- Να χρησιμοποιώ κάποιου CSS framework (Bootstrap 5)
- Να δημιουργώ popup modal παράθυρα με το Bootstrap 5
- Nα δημιουργώ αλληλεπιδραστικές web εφαρμογές (με χρήση AJAX κλήσεων)
- Nα δημιουργώ stateless μηχανισμό login βασισμένος σε JWT (JSON Web Tokens)


## Τεχνολογίες που χρησιμοποιήθηκαν

**Client:** HTML, CSS, JavaScript, [Bootstrap 5](https://getbootstrap.com/), [Leaflet JS](https://leafletjs.com/), OpenStreetMaps, AJAX

**Server:** XAMPP, WAMP, Apache, MySQL 8.0.27, PHP 8.0.13, [SLIM framework](https://www.slimframework.com/), [firebase/php-jwt](https://github.com/firebase/php-jwt), [tuupola/slim-jwt-auth](https://github.com/tuupola/slim-jwt-auth)

## Λειτουργίες

- Επιλογή καυσίμου στον χάρτη από ένα πρατήριο
- Παραγγελία επιλεγμένου καυσίμου (μόνο για συνδεμένους χρήστες) 
- Επίβλεψη παραγγελιών από τους ιδιοκτήτες πρατηρίου
- Αλλαγή τιμής καυσίμου από τους ιδιοκτήτες πρατηρίου
- Διαγραφή ολοκληρωμένης παραγγελίας από τους ιδιοκτήτες πρατηρίου


## Κλήσεις REST API

### GET: Λήψη δεδομένων πρατηρίων και τιμών επιλεγμένου καυσίμου.

```
  GET api.fuel.gr/gas_data
```

| Παράμετρος | Τύπος     | Περιγραφή                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Απαραίτητο**. Όνομα καυσίμου |

### GET: Πλήθος πρατηρίων (ακέραιος), μέγιστη, ελάχιστη και μέση τιμή ανά lt (με 3 δεκαδικά).

```
  GET api.fuel.gr/gas_count
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Απαραίτητο**. Όνομα πρατηρίου |


### GET: Λήψη τιμοκαταλόγου ενός πρατηρίου.

```
  GET api.fuel.gr/station_prices
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Απαραίτητο**. Κωδικός πρατηρίου |

### POST: LogIn χρήστη (η database έχει ήδη χρήστες).

```
  POST api.fuel.gr/login
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `user`      | `string` | **Απαραίτητο**. Όνομα χρήστη |
| `pass`     |  `string` | **Απαραίτητο**. Κωδικός πρόσβασης |

### POST: Αποστολή δεδομένων παραγγελίας από πλευράς χρήστη (ποσότητα).

```
  POST api.fuel.gr/order
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `Βearer Token` | `string` | **Απαραίτητο**. Κλειδί API (JWT) |
| `productID` | `int` | **Απαραίτητο**. Κωδικός καυσίμου |
| `user`     |  `string` | **Απαραίτητο**. Όνομα χρήστη που έκανε την παραγγελία |
| `quantity` |  `int` | **Απαραίτητο**. Ποσότητα καυσίμου σε λίτρα|

### GET: Λήψη παραγγελιών πρατηρίου

```
  GET api.fuel.gr/station_prices
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `Βearer Token` | `string` | **Απαραίτητο**. Κλειδί API (JWT) |
| `id` | `int` | **Απαραίτητο**. Κωδικός πρατηρίου |

### PUT: Αλλαγή τιμής σε καύσιμο

```
  PUT api.fuel.gr/change/gas_price
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `Βearer Token` | `string` | **Απαραίτητο**. Κλειδί API (JWT) |
| `stationID` | `int` | **Απαραίτητο**. Κωδικός πρατηρίου |
| `fuelName` |  `string` | **Απαραίτητο**. Όνομα καυσίμου |
| `price` |  `double` | **Απαραίτητο**. Νεά Τιμή καυσίμου |

### DELETE: Διαγραφή παραγγελίας από πρατηριούχο.


```
  DELETE api.fuel.gr/remove/order
```

| Παράμετρος | Τύπος     | Περιγραφή                       |
| :-------- | :------- | :-------------------------------- |
| `Βearer Token` | `string` | **Απαραίτητο**. Κλειδί API (JWT) |
| `orderID` | `int` | **Απαραίτητο**. Κωδικός παραγγελίας |

## Οδηγίες Εγκατάστασης

### Προαπαιτούμενα

Για να μπορέσετε να χρησιμοποιήσετε το project θα πρέπει πρώτα να έχετε εγκατεστημένο το [XAMPP](https://www.apachefriends.org/download.html) (Windows/Linux/OS X). 'Επειτα επειδή το project χρησιμοποιεί MySQL, θα πρέπει να αντικαταστήσετε την προεγκατεστημένη MariaDB με την MySQL σύμφωνα με τις οδηγίες [εδώ](https://gist.github.com/imron02/ea233267c6664345d1021866b91459d7). 


Εάν δεν θέλετε να κάνετε την παραπάνω διαδικασία μία άλλη εναλλακτική είναι το [WAMP](https://sourceforge.net/projects/wampserver/) (Μόνο για windows) καθώς είναι πιο εύρηστο και έχει προεγκατεστημένη την MySQL.

**Σημείωση: Σιγουρευτείτε ότι έχετε PHP έκδοση 8.0.13 και MySQL 8.0.27 για την σωστή λειτουργία της εφαρμογής!! Από το WAMP μπορείτε να την τσεκάρετε κατά την εγκατάσταση.
Επίσης όταν ανοίγετε το WAMP ή το XAMPP πρέπει να το ανοίγετε σαν διαχειριστής(Admin)!!**

### XAMPP

Εαν χρησιμοποιείτε XAMPP πηγαίνετε στον φάκελο όπου εγκαταστήσατε το XAMPP και μετά πηγάινετε στο apache\conf\extra και εισάγετε: 

#### Αρχείο httpd-vhosts.conf
```bash
<VirtualHost *:80>
DocumentRoot "C:/xampp/htdocs"
ServerName localhost
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/fuel.gr"
    ServerName fuel.gr
    <Directory "C:/xampp/htdocs/fuel.gr">
    AllowOverride All
    Require all granted
    </Directory>    
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/api.fuel.gr/public/"
    ServerName api.fuel.gr
    <Directory "C:/xampp/htdocs/api.fuel.gr/public/">
    Options FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
    </Directory>    
</VirtualHost>

```

*Σημείωση: Πρέπει να αλλάξετε το πρόθεμα C:/xampp σε όλες τις περιπτώσεις παραπάνω, εάν έχετε εγκαταστήσει το XAMPP σε άλλη τοποθεσία*

#### Εισαγωγή δεδομένων στο XAMPP με phpMyAdmin

Για να εισάγουμε δεδομένα στην MySQL του XAMPP πρεπει να μεταβείτε στον εξής σύνδεσμο:

[http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

Έπειτα κανουμε login ως root με κενό κωδικό πρόσβασης (αυτά είναι τα προεπιλεγμένα και αυτά χρησιμοιποιεί και η εφαρμογή,σε production φυσικά θα ήταν διαφορετικά για λόγους ασφάλειας). Στην συνέχεια κάνουμε κλίκ στην καρτέλα SQL. Από το αρχείο [εδώ](https://raw.githubusercontent.com/JohnKontodimos/REST-API-Web-App/main/Fuel.gr_db_data_schema_export.sql?token=GHSAT0AAAAAABRQ6E6WJZG37SAVGOVB6VHAYQWPQHQ) αντιγράφουμε όλο το κείμενο του και το επικολλούμε στην καρτέλα SQL στο phpMyAdmin.

Τέλος, για να εισάγουμε τα δεδομένα πατάμε το κουμπί Go. 

Εφόσον ολοκληρωθεί κλείνουμε το παράθυρο με το phpMyAdmin. 

### WAMP

**Σημείωση: Σιγουρευτείτε ότι έχετε PHP έκδοση 8.0.13 και MySQL 8.0.27 για την σωστή λειτουργία της εφαρμογής!! Από το WAMP μπορείτε να την τσεκάρετε κατά την εγκατάσταση. Ελέγξτε έδω: [phpMyAdmin](http://localhost/phpmyadmin/). Εαν δεν έχετε PHP έκδοση 8.0.13, μπορείτε να κάνετε αριστερό κλικ στο εικονίδιο στην γραμμή εργασίων και πηγαίνετε το ποντίκι στη PHP και μετά στο Version και έπειτα κάνετε κλίκ στο 8.0.13.**

Εαν χρησιμοποιείτε WAMP, εφόσον το έχετε ήδη ανοιχτό, μπορείτε να κάνετε αριστερό κλικ στο εικονίδιο στη γραμμή εργασιών και να πάτε το ποντίκι στο Apache. Μετά κάντε κλικ στο httpd-vhosts.conf (κάτω από Files & Documentation).
Αυτό θα σας ανοίξει το αρχείο στον επιλεγμένο text editor σας που ορίσατε κατα την διάρκεια της εγκατάστασης του WAMP, έτσι ώστε να μπορεσετε να το επεξεργαστείτε όπως παρακάτω: 

#### Αρχείο httpd-vhosts.conf
```bash
<VirtualHost *:80>
  ServerName localhost
  ServerAlias localhost
  DocumentRoot "${INSTALL_DIR}/www"
  <Directory "${INSTALL_DIR}/www/">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "${INSTALL_DIR}/www/fuel.gr"
    ServerName fuel.gr
    <Directory "${INSTALL_DIR}/www/fuel.gr">
    AllowOverride All
    Require all granted
    </Directory>    
</VirtualHost>

<VirtualHost *:80>
    DocumentRoot "${INSTALL_DIR}/www/api.fuel.gr/public/"
    ServerName api.fuel.gr
    <Directory "${INSTALL_DIR}/www/api.fuel.gr/public/">
    Options FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
    </Directory>    
</VirtualHost>
```
*Σημείωση: Σε αντίθεση με το XAMPP εδώ δε χρειάζεται να αλλάξουμε τίποτα, το αντιγράφουμε ως έχει παραπάνω.*
<br></br>

#### Αρχείο httpd.conf

Eφόσον έχετε το WAMP ανοιχτό κάνετε πάλι αριστερό κλικ στο εικονίδιο και πηγαίνετε το ποντίκι στο Apache και μετά κάνετε κλικ στο httpd.conf (κάτω από Files & Documentation).
Αυτό θα σας ανοίξει το αρχείο στον επιλεγμένο text editor σας που ορίσατε κατα την διάρκεια της εγκατάστασης του WAMP, έτσι ώστε να μπορέσετε να το επεξεργαστείτε όπως παρακάτω:

*Αντικαθιστούμε όπου `<Directory />` (περίπου στην γραμμή 250) και όχι `<Directory "${INSTALL_DIR}/www/">` ούτε `<Directory "${SRVROOT}/cgi-bin">`*

```bash
<Directory />
    Options +Indexes +FollowSymLinks
    Header set Access-Control-Allow-Origin "*"
    AllowOverride all
    Require local
</Directory>
```
#### Ενεργοποίηση του headers_module στο WAMP

Το headers_module είναι ένα απαραίτητο πρόσθετο για την λειτουργία της εφαρμογής καθώς μας επιτρέπει να στείλουμε και να διαβάσουμε δεδομένα στο Header κάθε http κλήσης.

Eφόσον έχετε το WAMP ανοιχτό κάνετε πάλι αριστερό κλικ στο εικονίδιο και πηγαίνετε το ποντίκι στο Apache και έπειτα πάνω στην επιλογή Apache modules. Από την μεγάλη λίστα που εμφανίζεται βεβαιωθείτε πως η επιλογή **headers_module** είναι τσεκαρισμένη.
Εαν δεν έιναι κάντε κλίκ πάνω της για να την ενεργοποιήσετε.
#### Εισαγωγή δεδομένων στο WAMP με phpMyAdmin

Για να εισάγουμε δεδομένα στην MySQL του WAMP πρεπει να μεταβείτε στον εξής σύνδεσμο:

[http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

Έπειτα κανουμε login ως root με κενό κωδικό πρόσβασης και με επιλογή την MySQL (αυτά είναι τα προεπιλεγμένα και αυτά χρησιμοιποιεί και η εφαρμογή,σε production φυσικά θα ήταν διαφορετικά για λόγους ασφάλειας). Στην συνέχεια κάνουμε κλίκ στην καρτέλα SQL. Από το αρχείο [εδώ](https://raw.githubusercontent.com/JohnKontodimos/REST-API-Web-App/main/Fuel.gr_db_data_schema_export.sql?token=GHSAT0AAAAAABRQ6E6WJZG37SAVGOVB6VHAYQWPQHQ) αντιγράφουμε όλο το κείμενο του και το επικολλούμε στην καρτέλα SQL στο phpMyAdmin. 

Τέλος, για να εισάγουμε τα δεδομένα πατάμε το κουμπί Go. 

Εφόσον ολοκληρωθεί κλείνουμε το παράθυρο με το phpMyAdmin.

#### Αρχείο hosts του λειτουργικού συστήματος

Ανεξαρτήτως τι χρησιμοποιείτε είναι απαραίτητο να προσθέσετε στο αρχείο του λειτουργικού σας συστήματος  τις εξής εγγραφές:
(π.χ. για Windows: C:\Windows\System32\drivers\etc\hosts)
```bash
127.0.0.1 api.fuel.gr
127.0.0.1 fuel.gr
```

### Τρέξτε το project τοπικά στον υπολογιστή σας

Εφόσον ακολουθήσαμε τα παραπάνω βήματα τώρα μπορούμε να τρέξουμε το project τοπικά στον υπολογιστή μας.

#### XAMPP
Πηγαίνετε στον φάκελο htdocs (εκεί αποθηκεύει το XAMPP τα αρχεία των web apps).

```bash
  cd htdocs
```
#### WAMP
Πηγαίνετε στον φάκελο www (εκεί αποθηκεύει το WAMP τα αρχεία των web apps) κάνοντας αριστερό κλίκ στο είκονίδιο του WAMP και έπειτα κάνετε κλίκ στην επιλογή **www directory**

Κάντε clone το project με το terminal (εφόσον έχετε πάει στον αντίστοιχο φάκελο από παραπάνω)

```bash
  git clone https://github.com/JohnKontodimos/REST-API-Web-App
```
Ή μπορείτε χειροκίνητα να αντιγράψετε τους φακέλους **api.fuel.gr** και **fuel.gr** μέσα στον φάκελο htdocs (για XAMPP) www (για WAMP) έφοσον κατεβάσατε τον κώδικα ως zip.

Έπειτα μπορείτε να ανοίξετε το site στον browser σας με το link:

[http://fuel.gr/](http://fuel.gr/)

*Σημείωση: Σιγουρευτείτε ότι έχετε PHP έκδοση 8.0.13 και MySQL 8.0.27 για την σωστή λειτουργία της εφαρμογής!! Δείτε έδω: [phpMyAdmin](http://localhost/phpmyadmin/)*

Για να τεστάρετε τις κλήσεις στο Rest API μπορείτε να χρησιμοποιήσετε λογισμικό όπως το [Postman](https://www.postman.com/downloads/).
Έπειτα μπορείτε να χρησιμοποιήσετε τις [δοθέντες κλήσεις στο Rest API](#κλήσεις-rest-api).
<br><br/>
## Άδεια

[MIT](https://choosealicense.com/licenses/mit/)

## Συγγραφέας

[Ιωάννης Κοντοδήμος](https://github.com/JohnKontodimos)

