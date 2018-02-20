numLEDs = document.getElementById('numLEDs').value;

noteImage = document.createElement('img');
noteImage.src = './images/noteIm.png';

var isKeyPressed = [];
var asciiKeyToKeyboard = [];

asciiKeyToKeyboard[65] = 0; //a
asciiKeyToKeyboard[83] = 1; //s
asciiKeyToKeyboard[68] = 2; //d
asciiKeyToKeyboard[70] = 3; //...
asciiKeyToKeyboard[71] = 4;
asciiKeyToKeyboard[72] = 5;
asciiKeyToKeyboard[74] = 6;
asciiKeyToKeyboard[75] = 7;
asciiKeyToKeyboard[76] = 8; //l

$(document).keydown(function(e){
    var number = e.which;
    if (!isKeyPressed[number]){
        isKeyPressed[number] = true;
		if (asciiKeyToKeyboard[number] != null) {
			noteStart(asciiKeyToKeyboard[number]);
		} else {
			padPress(number);
		}
    }
});
$(document).keyup(function(e){
    var number = e.which;
	if (isKeyPressed[number]){
        isKeyPressed[number] = false;
		if (asciiKeyToKeyboard[number] != null) {
			noteEnd(asciiKeyToKeyboard[number]);
		}
    }
});

function open_image(image){

	var Layers = document.getElementById('myFrame').contentWindow.Layers;
	var name = image.src.replace(/^.*[\\\/]/, '');
	var new_layer = {
		name: name,
		type: 'image',
		data: image,
		width: image.naturalWidth || image.width,
		height: image.naturalHeight || image.height,
		width_original: image.naturalWidth || image.width,
		height_original: image.naturalHeight || image.height,
	};
	Layers.insert(new_layer);
}
