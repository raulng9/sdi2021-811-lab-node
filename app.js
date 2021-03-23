let express = require("express");
let app = express();

app.set("port", 8081);


require("./routes/rcanciones.js")(app);
require("./routes/rusuarios.js")(app);

app.listen(app.get("port"), function(){
   console.log("Servidor activo");
});