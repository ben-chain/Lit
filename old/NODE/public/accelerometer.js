//function deviceMotionHandler(eventData) {
//    var info, xyz = "[X, Y, Z]";
//    
//    // Grab the acceleration from the results
//    var acceleration = eventData.acceleration;
//    info = xyz.replace("X", acceleration.x);
//    info = info.replace("Y", acceleration.y);
//    info = info.replace("Z", acceleration.z);
//    document.getElementById("moAccel").innerHTML = info;
//    
//    // Grab the acceleration including gravity from the results
//    acceleration = eventData.accelerationIncludingGravity;
//    info = xyz.replace("X", acceleration.x);
//    info = info.replace("Y", acceleration.y);
//    info = info.replace("Z", acceleration.z);
//    document.getElementById("moAccelGrav").innerHTML = info;
//    
//    // Grab the rotation rate from the results
//    var rotation = eventData.rotationRate;
//    info = xyz.replace("X", rotation.alpha);
//    info = info.replace("Y", rotation.beta);
//    info = info.replace("Z", rotation.gamma);
//    document.getElementById("moRotation").innerHTML = info;
//    
//    // // Grab the refresh interval from the results
//    info = eventData.interval;
//    //document.getElementById("moInterval").innerHTML = info;
//}
//
//function deviceOrientationHandler(eventData){
//    var info, xyz = "[X, Y, Z]";
//    info = xyz.replace("X", Math.round(eventData.alpha));
//    info = info.replace("Y", Math.round(eventData.beta));
//    info = info.replace("Z", Math.round(eventData.gamma));
//    //document.getElementById("orientation").innerHTML = info;
//}
//
//if (window.DeviceMotionEvent) {
//    window.addEventListener('devicemotion', deviceMotionHandler, false);
//}
