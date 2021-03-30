module.exports = function(app, swig){

    app.get('/autores/agregar', function(req,res){
        let posiblesRoles = [{
            "nombreRol": "bateria"
        },{
            "nombreRol": "guitarrista"
        },{
            "nombreRol": "bajista"
        },{
            "nombreRol": "teclista"
        },{
            "nombreRol": "cantante"
        }
        ];
        let respuesta = swig.renderFile('views/autores-agregar.html',{
            roles: posiblesRoles
        });
        res.send(respuesta);
    });

    app.post("/autores/agregar", function(req,res){
        res.send("Autor agregado: " + req.body.nombre + "<br>" + " grupo:" + req.body.grupo + "<br>" + " rol: " + req.body.rol);
    });

    app.get("/autores", function(req,res){

        let autores = [{
            "nombre": "Kevin Parker",
            "grupo": "Tame impala",
            "rol": "Bajista"
        },{
            "nombre": "Richard D. James",
            "grupo": "Aphex Twin",
            "rol": "Teclista"
        },{
            "nombre": "Stevie Nicks",
            "grupo": "Fleetwood Mac",
            "rol": "Cantante"
        }
        ];
        let respuesta = swig.renderFile("views/autores.html", {
            vendedor: "Lista de autores",
            autores: autores
        });
        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    });


    app.get('/autores/filtrar/:rol', function (req, res) {
        res.redirect("/autores");
    });

    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    });

};