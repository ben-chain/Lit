[data, fs] = audioread('24k magic.mp3');
data = mean(data, 2);
% data = data(1:500000);

figure(324444);
spectrogram(data, 1000, [], [], fs, 'yaxis');
colormap jet;

spectro = spectrogram(data, 1000, [], [], fs, 'yaxis');
% set(gca, 'YScale', 'log')
colormap('jet');
% caxis([0 .7]);

frameRate = 29.9701*10;
songLengthInSec = length(data) / fs;
songlengthInPx = songLengthInSec * frameRate;

spectro = imresize(spectro(1:100,:), [512 songlengthInPx]);
% figure(123123123);clf; imshow(abs(spectro)');

imwrite(spectro', 'spectro.png');