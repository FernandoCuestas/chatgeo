var socket = io();

socket.on('connect', function () {
  console.log('Conectado al server');
});

socket.on('disconnect', function () {
  console.log('Desconectado del server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>').addClass("animated bounceIn");
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>').addClass("animated bounceIn");
  var a = jQuery('<a target="_blank">Mi actual conexion</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');
  
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('No soporta Geolocalizacion el Navegador.');
  }

  locationButton.attr('disabled', 'disabled').text('Enviando Localizacion...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Enviar Localizacion');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Enviar Localizacion');
    alert('No se puede recuperar la ubicación.');
  });
});
