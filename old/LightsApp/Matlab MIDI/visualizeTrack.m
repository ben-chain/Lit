function out = visualizeTrack(track, args)
pitches = [track.pitch];
startTimes = [track.startTime];
endTimes = [track.endTime];

figure(654654);
histogram(pitches);
title([' Track MIDI Pitch Histogram'])
xlabel 'MIDI pitch'
ylabel 'Number of notes'

numTimeDivs = 2;
figure(635456);
pitchCtrs = min(pitches):max(pitches);
timeCtrs = linspace(min(startTimes),max(startTimes),numTimeDivs);
theHist = hist3([pitches; startTimes]',{pitchCtrs,timeCtrs});
xlabel pitch
ylabel time
zlabel('Count')
title([' Track MIDI Pitch-Time Histogram'])

figure(65465);clf; hold on; theLegend = {};
greaterThan = 0:5;
for j = 1:length(greaterThan)
for i = 1:size(theHist,2) %For each time div
    notesHere = find(theHist(:,i) > greaterThan(j));
    numNotesHereGtrThan(i,j) = numel(unique(notesHere))
end

plot(timeCtrs, numNotesHereGtrThan(:,j),'.-');
theLegend{j} = sprintf('Number of Notes > %i',greaterThan(j));
end
legend(theLegend)