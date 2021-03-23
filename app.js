let express = require("express");
let app = express();

let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("port", 8081);


require("./routes/rcanciones.js")(app);
require("./routes/rusuarios.js")(app);

app.listen(app.get("port"), function(){
   console.log("Servidor activo");
});