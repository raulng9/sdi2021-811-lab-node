module.exports = function(app, gestorBD) {
    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
        if (canciones == null) {
            res.status(500); res.json({
                error : "se ha producido un error"
            })
        } else {
            res.status(200);
            res.send( JSON.stringify(canciones) );
        }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerCanciones(criterio,function(canciones){ if ( canciones == null ){
            res.status(500); res.json({
                error : "se ha producido un error" })
        } else {
            res.status(200);
            res.send( JSON.stringify(canciones[0]) );
        }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        //Similar a comprable en el lab anterior
        let idCancionAModificar = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;
        isCancionModificable(usuario, idCancionAModificar, function(sePuedeEliminar){
            if(sePuedeEliminar){
                gestorBD.eliminarCancion(criterio,function(canciones){
                if ( canciones == null ){
                    res.status(500);
                    res.json({ error : "se ha producido un error" })
                } else {
                    res.status(200);
                    res.send( JSON.stringify(canciones) );
                }
                });
            }else{
                res.status(400);
                res.json({ error: "El usuario no puede eliminar esta canción ya que no es el autor "})
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        let cancion = {
        nombre : req.body.nombre,
        genero : req.body.genero,
        precio : req.body.precio,
        autor: res.usuario
    }
        // ¿Validar nombre, genero, precio?, ahora sí
        if(cancion.nombre == null || cancion.nombre === ""){
            res.status(400);
            res.json({
                error: "Nombre inválido (null o vacío)"
            });
        }else if (cancion.genero == null || cancion.genero === ""){
            res.status(400);
            res.json({
                error: "Género inválido (null o vacío)"
            });
        }else if (cancion.precio == null || cancion.precio === "" || parseFloat(cancion.precio) < 0){
            res.status(400);
            res.json({
                error: "Precio inválido (negativo o vacío)"
            });
        }else {
            gestorBD.insertarCancion(cancion, function (id) {
                if (id == null) {
                    res.status(500);
                    res.json({
                        error: "Se ha producido un error al añadir la canción"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje: "Canción insertada correctamente",
                        _id: id
                    })
                }
            });
        }
    });


    app.put("/api/cancion/:id", function(req, res) {
        let criterio = {
            "_id" : gestorBD.mongo.ObjectID(req.params.id)
        };
        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null){
             cancion.nombre = req.body.nombre;
        }else{
            res.status(400);
            return res.json({
                error : "Nombre inválido"
            });
        }
        if ( req.body.genero != null) {
            cancion.genero = req.body.genero;
        }else{
            res.status(400);
            return res.json({
                error : "Género inválido"
            });
        }
        if ( req.body.precio != null) {
            cancion.precio = req.body.precio;
        }else{
            res.status(400);
            return res.json({
                error : "Precio inválido"
            });
        }

        let idCancionAModificar = gestorBD.mongo.ObjectID(req.params.id);
        let usuario = res.usuario;

        isCancionModificable(usuario, idCancionAModificar, function(modificable){
            if(modificable){
                gestorBD.modificarCancion(criterio, cancion, function(result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "Se ha producido un error al modificar la canción" })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje: "Canción modificada correctamente",
                            _id: req.params.id
                        })
                    }
                });
            }else{
                res.status(400);
                res.json({ error: "El usuario no puede modificar esta canción ya que no es el autor "});
            }
        });

    });

    app.post("/api/autenticar/", function(req,res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if(usuarios==null || usuarios.length === 0){
                res.status(401);
                res.json({autenticado:false})
            }
            else {
                let token = app.get('jwt').sign({
                    usuario: criterio.email,
                    tiempo: Date.now()/1000
                }, "secreto");
                res.status(200);
                res.json(
                    {
                        autenticado: true,
                        token: token
                    })
            }
        })
    });

    function isCancionModificable(usuario, idCancionAModificar, callback){
        let criterioEsAutorCancion = { $and: [
                { "_id": idCancionAModificar },
                { "autor": usuario }
            ] };
        gestorBD.obtenerCanciones(criterioEsAutorCancion, function(canciones) {
            if (canciones == null || canciones.length <= 0) {
                callback(false);
            } else {
                callback(true);
            }
        });
    }
}


