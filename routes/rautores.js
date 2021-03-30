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
            "rol": "bajista"
        },{
            "nombre": "Richard D. James",
            "grupo": "Aphex Twin",
            "rol": "teclista"
        },{
            "nombre": "Stevie Nicks",
            "grupo": "Fleetwood Mac",
            "rol": "cantante"
        }
        ];
        let respuesta = swig.renderFile("views/autores.html", {
            vendedor: "Lista de autores",
            autores: autores
        });
        res.send(respuesta);
    });

    app.get("/autores/filtrar/:rol", function(req,res){

        let autores = [{
            "nombre": "Kevin Parker",
            "grupo": "Tame impala",
            "rol": "bajista"
        },{
            "nombre": "Richard D. James",
            "grupo": "Aphex Twin",
            "rol": "teclista"
        },{
            "nombre": "Stevie Nicks",
            "grupo": "Fleetwood Mac",
            "rol": "cantante"
        }
        ];

        const filteredAutores = autores.filter( autor => autor.rol === req.params.rol);

        let respuesta = swig.renderFile("views/autores.html", {
            vendedor: "Lista de autores",
            autores: filteredAutores
        });
        res.send(respuesta);
    });

    app.get('/autores/*', function (req, res) {
        res.redirect("/autores");
    });

};