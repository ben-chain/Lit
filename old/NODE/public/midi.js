function initMidi(){
	console.log("initmidi called");
	context = new AudioContext(),
		oscillators = {};
 
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess()
			.then(midiSuccess, midiFailure);
	}
 
 
	midiCtx = newLayerCtx();
	
	prefix = '/images/midi/translate/notes/longfade';
	startPrefix = prefix + 'Start';
	notePrefix = prefix + 'Note';
	endPrefix = prefix + 'End';
	midiNoteRange = [48, 72];
	startImages = [];
	noteImages = [];
	endImages = [];
	for (i = midiNoteRange[0]; i <= midiNoteRange[1]; i++) {
		startImages[i] = document.createElement('img');
		startImages[i].src = startPrefix + i + '.png';
		
		noteImages[i] = document.createElement('img');
		noteImages[i].src = notePrefix + i + '.png';
		
		endImages[i] = document.createElement('img');
		endImages[i].src = endPrefix + i + '.png';
	}
}


function midiSuccess (midi) {
    var inputs = midi.inputs.values();
    // inputs is an Iterator
 
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // each time there is a midi message call the onMIDIMessage function
        input.value.onmidimessage = onMIDIMessage;
    }
}
 
function midiFailure () {
    console.error('No access to your midi devices.')
}
 
isPlaying = [];
function onMIDIMessage (message) {
	var buttonIndex = message.data[1];
 
	console.log(message);
	console.log('plyints: ' + playingIntervals[buttonIndex]);
    if (message.data[0] === 144 && message.data[2] > 0 && !isPlaying[buttonIndex]) {
		noteDown(buttonIndex);
    //} else if (message.data[0] === 160 || message.data[2] === 0 && playingIntervals[buttonIndex]) {
    } else if (message.data[0] !== 160 && message.data[2] === 0 && isPlaying[buttonIndex]) {
        //noteUp(buttonIndex);
		isPlaying[buttonIndex] = false;
		console.log('interval off');
    }
}

nextNotePlace = [];
playingIntervals = [];
antiFlickerDelay = 2;
function noteDown(buttonIndex){
	console.log("midi note " + buttonIndex + " played.");
	nextNotePlace[buttonIndex] = frame + antiFlickerDelay;
    midiCtx.drawImage(startImages[buttonIndex],0,nextNotePlace[buttonIndex]);
	isPlaying[buttonIndex] = true;
	noteLoop(buttonIndex);
	
	clearInterval(playingIntervals[buttonIndex]);
	playingIntervals[buttonIndex] = setInterval(function(){
		noteLoop(buttonIndex);
	},
	1000 * noteImages[buttonIndex].height / playBackFrameRate);
}

function noteLoop(buttonIndex) {
		if (isPlaying[buttonIndex]) {
			midiCtx.drawImage(noteImages[buttonIndex],0,nextNotePlace[buttonIndex]);
		} else {
			midiCtx.drawImage(endImages[buttonIndex],0,nextNotePlace[buttonIndex]);
			clearInterval(playingIntervals[buttonIndex]);
		}
		nextNotePlace[buttonIndex] = nextNotePlace[buttonIndex] + noteImages[buttonIndex].height;
}

function noteUp(buttonIndex){
			console.log("midi note " + buttonIndex + " ended.");

    //setTimeout(function(){
		
		
		isPlaying[buttonIndex] = false;
		console.log('interval off');	
	//}, 1000*noteImages[buttonIndex].height / playBackFrameRate );

}

