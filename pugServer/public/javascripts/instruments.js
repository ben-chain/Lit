
noteStart = function(number){
    var position = number/9 * numLEDs;
    var noteLayer = placeImageAt(noteImage, position);
    //notePlaceInterval[number]
}

noteEnd = function(number){

}

numNotesPlaced=0;
placeImageAt = function(image, position){
    var Layers = document.getElementById('minipaint').contentWindow.Layers;
    var name = image.src.replace(/^.*[\\\/]/, '');
    var theName = "note" + numNotesPlaced;
	var new_layer = {
		name: theName,
		type: 'image',
		data: image,
		width: image.naturalWidth || image.width,
		height: image.naturalHeight || image.height,
		width_original: image.naturalWidth || image.width,
		height_original: image.naturalHeight || image.height,
	};
    Layers.insert(new_layer);
    var arrayOfLayers = Layers.get_sorted_layers();
    //var thisLayer = arrayOfLayers[arrayOfLayers.length -1];
    var thisLayer = arrayOfLayers[0];
    thisLayer.x = position;
    thisLayer.y = getHeight();
    numNotesPlaced++;
    renderUpdate();
    return thisLayer;
}