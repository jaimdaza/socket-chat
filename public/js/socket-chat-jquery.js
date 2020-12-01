var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

//referencia -usuarios
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatBox');

// funciones para renderizar usuarios

function renderizarusuarios(personas) {
    console.log(personas);
    var html = '';
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de ' + params.get('sala') + '</a>';
    html += '</li>';
    personas.forEach(persona => {
        html += '<li>';
        html += '<a data-id="' + persona.id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persona.nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';

    });
    divUsuarios.html(html);
    $('#sala').html('<h3 class="box-title"> <small>Sala de chat </small> ' + params.get('sala') + '</h3>');
};

function renderizarMensajes(mensaje, yo) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }
    if (yo) {
        html += '  <li class="reverse animated fadeIn">';
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.nombre + '</h5>';
        html += '     <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '  </div>';
        html += '  <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '  <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '      <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '</div> <div class="chat-time">' + hora + '</div>';
        html += ' </li>';
    }
    divChatbox.append(html);
}

//Listener
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    console.log(id);
});

formEnviar.on('submit', function(e) {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        console.log("Respuesta", mensaje);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true);
        scrollBottom();
    });

});

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}