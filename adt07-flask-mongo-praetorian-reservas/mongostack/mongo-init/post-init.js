db = db.getSiblingDB('deporte');

db.reservas.find().forEach((reserva) => {
    if (!reserva.usuario || !reserva.usuario.username) return; 

    const username = reserva.usuario.username; 
    db.reservas.updateOne({ _id: reserva._id }, { $unset: { usuario: "" } }); 

    const usuario = db.usuarios.findOne({ username: username });

    if (usuario) {
        db.reservas.updateOne(
            { _id: reserva._id },
            { $set: { usuario: usuario._id } }
        );
    } else {
        print(`Usuario ${username} no encontrado en la BD`);
    }
});