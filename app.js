let express = require("express");
let app = express();

let mongo = require('mongodb');
let swig = require("swig");
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("port", 8081);
app.set('db','mongodb://admin:sdi@tiendamusica-shard-00-00.ilutx.mongodb.net:27017,tiendamusica-shard-00-01.ilutx.mongodb.net:27017,tiendamusica-shard-00-02.ilutx.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ctmrkc-shard-0&authSource=admin&retryWrites=true&w=majority');


require("./routes/rcanciones.js")(app,swig,mongo);
require("./routes/rusuarios.js")(app,swig);
require("./routes/rautores.js")(app,swig);

app.listen(app.get("port"), function(){
   console.log("Servidor activo");
});