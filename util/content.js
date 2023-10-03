var players = document.getElementsByTagName('video');
for (var i = 0, l = players.length; i < l; i++) {
    players[i].controls = true;
}
