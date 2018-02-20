heightOfNextNoteAt = [];
notePlaceInterval = [];
lastPlacedLayerOf = [];

noteStart = function(number){
    var position = number/9 * numLEDs;
    var noteLayer = placeImageAt(noteImage, position);
    //notePlaceInterval[number]
	heightOfNextNoteAt[number] = noteLayer.y + noteLayer.height;
	var timeToNextNote = noteLayer.height / heightPerSecond * 1000;
	
	var placeNextNote = function(){
		lastPlacedLayerOf[number] = placeImageAt(noteImage, position, heightOfNextNoteAt[number]);
		heightOfNextNoteAt[number] = heightOfNextNoteAt[number] + noteLayer.height;
	}
	placeNextNote();
	notePlaceInterval[number] = setInterval(placeNextNote, timeToNextNote);
}

noteEnd = function(number){
	var position = number/9 * numLEDs;
	Layers[lastPlacedLayerOf[number]] = [];
	clearInterval(notePlaceInterval[number]);
	lastPlacedLayerOf[number] = placeImageAt(noteImage, position, heightOfNextNoteAt[number]);
}

padImages = [];
padPress = function(keyNumber){ //in ascii
	console.log('padpress: ' + keyNumber);
	if (wasImageJustUploaded){
		wasImageJustUploaded = false;
		padImages[keyNumber] = mostRecentUpload;
	} else {
		placeImageAt(padImages[keyNumber],0);
	}
}

//
//  This is the Touchpad
//
//dropzone = document.getElementById("w");
wasImageJustUploaded = false;
Dropzone.options.myDropzone = {

  // Prevents Dropzone from uploading dropped files immediately
  autoProcessQueue: false,

  init: function() {
    var submitButton = document.querySelector("#submit-all")
        myDropzone = this; // closure

    // You might want to show the submit button only when 
    // files are dropped here:
    this.on("addedfile", function(file) {
      // Show submit button here and/or inform user to click it.
	  recentFile = file;
	  setTimeout(function(file){
		mostRecentUpload = new Image;
		mostRecentUpload.src = recentFile.dataURL;
		console.log('ready to take keypress for new upload');//recentFile.dataURL);
		wasImageJustUploaded = true;
	  }, 3000);
    
	});

  }
};


/*
myDropzone = new Dropzone("div#myId", { url: "/file/post"});
myDropzone.autoProcessQueue = false;

myDropzone.on("addedfile", function(file) {
    // Maybe display some more file information on your page 
	console.log(file);
  }); */


//
// place image function 
//

numNotesPlaced=0;
placeImageAt = function(image, position, height){
	if (height === undefined) {
		height = getHeight();
	}

    Layers = document.getElementById('minipaint').contentWindow.Layers;
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
    thisLayer.y = height;//getHeight();
    numNotesPlaced++;
    renderUpdate();
    return thisLayer;
}