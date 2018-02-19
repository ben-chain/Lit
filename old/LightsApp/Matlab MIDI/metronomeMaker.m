function beamOut = metronomeMaker(framerate, args);
args.numLights = 150;
[Y, fs] = audioread('metronome.mp3');
Y = Y - mean(mean(Y));
Y = abs(Y);
Y = Y(:,1)/max(max(Y));
Y = smooth(Y,1000);
totTime = length(Y)/fs;
numMetFrames = framerate * totTime;
ySamplePoints = linspace(0,totTime,numMetFrames);
beamOut = interp1(linspace(0,totTime,length(Y)),Y,ySamplePoints);

beamOut = permute(beamOut,[2,1,3]);
beamOut = repmat(beamOut,1,args.numLights,3);