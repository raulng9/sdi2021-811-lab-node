let express = require("express");
let app = express();


let expressSession = require('express-session');
app.use(expressSession({
   secret: 'abcdefg',
   resave: true,
   saveUninitialized: true
}));

let crypto = require('crypto');
let fileUpload = require('express-fileupload');
app.use(fileUpload());
let mongo = require('mongodb');
let swig = require("swig");
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// routerUsuarioSession
let routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
   console.log("routerUsuarioSession");
   if ( req.session.usuario ) {
      // dejamos correr la petición
      next();
   } else {
      console.log("va a : "+req.session.destino)
      res.redirect("/identificarse");
   }
});

//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
app.use("/cancion/*",routerUsuarioSession);

//routerAudios
let routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
   console.log("routerAudios");
   let path = require('path');
   let idCancion = path.basename(req.originalUrl, '.mp3');

   gestorBD.obtenerCanciones(
       {_id : mongo.ObjectID(idCancion) }, function (canciones) {
          if(req.session.usuario && canciones[0].autor === req.session.usuario ){
             next();
          } else {
             res.redirect("/tienda");
          }
       })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);


//routerUsuarioAutorComentario
let routerUsuarioAutorComentario = express.Router();
routerUsuarioAutorComentario.use(function(req, res, next) {
   console.log("routerUsuarioAutorComentario");
   let path = require('path');
   let id = path.basename(req.originalUrl);
   gestorBD.obtenerComentarios(
       {_id: mongo.ObjectID(id) }, function (comentarios) {
          if(comentarios[0].autor === req.session.usuario ){
              next();
          } else {
              res.send("No eres el autor de este comentario");
          }
       })
});
//Aplicar routerUsuarioAutorComentario
app.use("/comentario/borrar",routerUsuarioAutorComentario);



app.use(express.static("public"));
app.set("port", 8081);
app.set('db','mongodb://admin:sdi@tiendamusica-shard-00-00.ilutx.mongodb.net:27017,tiendamusica-shard-00-01.ilutx.mongodb.net:27017,tiendamusica-shard-00-02.ilutx.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ctmrkc-shard-0&authSource=admin&retryWrites=true&w=majority');
app.set('clave','abcdefg');
app.set('crypto',crypto);

require("./routes/rcanciones.js")(app,swig,gestorBD);
require("./routes/rusuarios.js")(app,swig,gestorBD);
require("./routes/rcomentarios.js")(app, swig,gestorBD);
require("./routes/rautores.js")(app,swig);

app.listen(app.get("port"), function(){
   console.log("Servidor activo");
});