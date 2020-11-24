const { io } = require('../server');
const { Usuarios } = require('../clasees/usuarios');
const usuarios = new Usuarios();

const { crearMensaje } = require('../utils/utils');

io.on('connection', (client) => {
    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || (!usuario.sala)) {
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesario'
            });
        }
        // unir usuario a una sala
        client.join(usuario.sala);
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);
        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(usuario.sala));
        callback(usuarios.getPersonasPorSalas(usuario.sala));
    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    })


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSalas(personaBorrada.sala));
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        // para enviar un mensaje a alguien en especifico 
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});