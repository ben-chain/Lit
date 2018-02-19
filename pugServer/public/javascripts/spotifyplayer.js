theToken = getParameterByName('access_token');

if (theToken){
    console.log('found spotify token in url:');
    console.log(theToken);
    spotifyApi = new SpotifyWebApi();
    
    spotifyApi.setAccessToken(theToken);
    
    var spotifyState = spotifyApi.getMyCurrentPlaybackState();
    spotifyState.then(function(playbackState) {
        document.getElementById('spotifyPause').addEventListener('click', function() {
            spotifyApi.pause({ device_id: playbackState.device.id }).then(function(){
                spotifyPaused(spotifyApi);
            });
        });
        document.getElementById('spotifyPlay').addEventListener('click', function() {
            spotifyApi.play({ device_id: playbackState.device.id }).then(function(){
                spotifyPlayed(spotifyApi);
            });
        });
    });    
}






var stateKey = 'spotify_auth_state';

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


document.getElementById('spotifyAuth').addEventListener('click', function() {

var client_id = '03f3ea01b7354f26853b2eabf4776e20'; // Your client id
var redirect_uri = 'http://localhost:3000/controller.html'; // Your redirect uri

var state = generateRandomString(16);

localStorage.setItem(stateKey, state);
var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing';

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
url += '&state=' + encodeURIComponent(state);

console.log(encodeURIComponent(redirect_uri));
console.log(url);
window.location = url;
}, false);



function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}