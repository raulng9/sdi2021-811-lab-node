let express = require("express");
let app = express();


let swig = require("swig");
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("port", 8081);


require("./routes/rcanciones.js")(app,swig);
require("./routes/rusuarios.js")(app,swig);

app.listen(app.get("port"), function(){
   console.log("Servidor activo");
});