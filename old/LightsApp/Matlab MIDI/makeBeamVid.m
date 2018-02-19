function makeBeamVid(beam, framerate, startOff, args)

numPadFrames = round( framerate * startOff);
beam = padarray(beam, [numPadFrames, 0, 0], 0, 'pre');

mp3file = 'killer.mp3'; %.9645 [5 1 4]
% mp3file = 'metronome.mp3';
% mp3file = 'shelter.mp3';

beam = beam - min(min(min(beam)));
beam = beam / max(max(max(beam)));

video = permute(beam, [4, 2, 3, 1]);

v = VideoWriter('beamVid');
v.FrameRate = framerate;
open(v);
writeVideo(v,video);
close(v)

% dos(['ffmpeg\ffmpeg -y -i beamVid.avi -i ' mp3file ' ' ...
%     '-c:v copy -c:a aac -strict experimental beamVid.mov'])

PATH = getenv('PATH');
setenv('PATH', [PATH ':/usr/local/Cellar/ffmpeg/3.1.1/bin']);
dos(['ffmpeg -y -i beamVid.avi -i ' mp3file ' ' ...
    '-c:v copy -c:a aac -strict experimental beamVid.mov'])


dos('del "beamVid.avi"')
dos(['"C:\Program Files (x86)\QuickTime\QuickTimePlayer.exe" "' pwd '\beamVid.mov"'])