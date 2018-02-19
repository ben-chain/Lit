playBackFrameRate = 0;

function playRec(){
   // if (framePlayInterval) {
   //     return;
   // }
    playBackFrameRate = 29.9701; //*10
    setupMeter()
    theAudio = document.getElementById("theAudio");
    //theAudio.currentTime = frame/playBackFrameRate;

    frameTInMS = 1000/playBackFrameRate;
    recPaused = false;
    
    updateFrame();
    theAudio.play();
    
}

function pauseRec(){
    theAudio.pause();
    recPaused = true;
}

function setupMeter(){
    meter = new FPSMeter({
        position: 'absolute', // Meter position.
        zIndex:   10,         // Meter Z index.
        left:     '170px',      // Meter left offset.
        top:      '5px',
    });
  
}

function updateFrame(){
    if (!recPaused){
        setTimeout(updateFrame, frameTInMS);
    } else {
        console.log("paused at frame: %ff", frame);
    }
    frame = theAudio.currentTime * playBackFrameRate;
    meter.tick();
}
