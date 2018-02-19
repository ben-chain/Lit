function playBeam(beam,args)
startOff = -1;
args.frameRate = 20;
args.adjustFactor = 0; %calibrate from metronome below 1.08
frameRate = args.frameRate*args.adjustFactor;

numRemFrames = round( frameRate * startOff);
beam = beam((numRemFrames+1):end,:,:);

beam = uint8(beam*10);
numLights = size(beam,2);
numFrames = size(beam,1);
% frameRate = numFrames/230;
startOff = 1;
period = 1/frameRate;

[y,Fs] = audioread('shelter.mp3');
numPadFrames = round( frameRate * startOff);
if numPadFrames > 0
    beam = padarray(beam, [numPadFrames, 0, 0], 0, 'pre')*1.5;
else
    y = [zeros(0, numPadFrames * -1) y];
end

conn = udp('192.168.4.1',7777) ;
fopen(conn);

pad = uint8([0 0 0]);

frameNum = 1;
while frameNum <= size(beam,1)
red = beam(frameNum,:,1);
green = beam(frameNum,:,2);
blue = beam(frameNum,:,3);
frame(:,frameNum) = reshape([green;red;blue],1,[]);
frameNum = frameNum + 1;
end

sound(y, Fs);

frameNum = 1;
tic
tocOld = toc;
tocTemp = toc;

while frameNum < size(beam,1)


    
while tocTemp - tocOld < period
   tocTemp = toc;
end
tocOld = tocOld + period;
frameNum = frameNum + 1;

%disp(sum(frame))

fwrite(conn, [pad'; frame(:,frameNum)]);

end
toc

%fwrite(conn,[