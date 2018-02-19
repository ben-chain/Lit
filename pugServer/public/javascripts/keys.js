numLEDs = document.getElementById('numLEDs').value;

noteImage = document.createElement('img');
noteImage.src = './images/noteIm.png';

var isNotePressed = [];
$(document).keydown(function(e){
    var number;
    switch(e.which) {
        case 65: //a
            number=0;
            break;
        case 83: //s
            number=1;
            break;
        case 68: //d
            number=2;
            break;
        case 70: //f
            number=3;
            break;
        case 71: //g
            number=4;
            break;
        case 72: //h
            number=5;
            break;
        case 74: //j
            number=6;
            break;
        case 75: //k
            number=7;
            break;
        case 76: //l
            number=8;
            break;
        }
    if (!isNotePressed[number]){
        noteStart(number);
        isNotePressed[number] = true;
    }
});
$(document).keyup(function(e){
    var number;
    switch(e.which) {
        case 65: //a
            number=0;
            break;
        case 83: //s
            number=1;
            break;
        case 68: //d
            number=2;
            break;
        case 70: //f
            number=3;
            break;
        case 71: //g
            number=4;
            break;
        case 72: //h
            number=5;
            break;
        case 74: //j
            number=6;
            break;
        case 75: //k
            number=7;
            break;
        case 76: //l
            number=8;
            break;
        }
    if (isNotePressed[number]){
        noteEnd(number);
        isNotePressed[number] = false;
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
