module.exports = function(app, swig, gestorBD) {

    app.post('/comentario/:cancion_id', function(req, res) {
        if(req.session.usuario == null) {
            res.send("No se puede enviar el comentario ya que el usuario no está autenticado");
            return;
        }

        let comentario = {
            autor: req.session.usuario,
            texto: req.body.textoComentario,
            cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id),
        };

        gestorBD.insertarComentario(comentario, function(id) {
            if (id == null){
                res.send("Ocurrió un error al enviar el comentario");
            } else {
                res.redirect('/cancion/'+req.params.cancion_id);
            }
        });
    });

    app.get('/comentario/borrar/:id', function (req, res) {
        let criterio = {"_id" : gestorBD.mongo.ObjectID(req.params.id) };
        gestorBD.eliminarComentario(criterio,function(comentarios){
            if ( comentarios == null ){
                res.send("El comentario a eliminar no existe");
            } else {
                res.redirect('/publicaciones');
            }
        });
    })

};