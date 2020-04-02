import Player from './player.js';
import {$} from './utils.js';

let beginTime;
let multiple = true;
let playerVideoB;
let playerVideoC;

// display time to video load
const setTime = () => {
  const endTime = new Date();
  const startTime = (endTime.getTime() - beginTime.getTime()) / 1000;
  $('time').innerHTML = `${startTime} seconds`;
};

// Initialize main player.  
//
// If `multiple` is selected, then initialize all players but wait till after main 
// player loads and video starts prior to loading the next videos that the user can select
// ** Note, currently loading subsequent videos all at once but could load 
// them one at a time to help with performance
// 
// If 'single` is selected, all videos will be played in the same player
const initializePlayers = () => {
  multiple = $('multiple').checked;
  const videoA = $('videoA');
  const overlays = [{
    content: $('endedOverlay'),
    showBackground: false,
    align: 'top',
    start: 'show-options',
    end: 'loadstart'
  }];
  
  const player = new Player();
  // load main player
  player.initialize({
    id: 'videojs-player',
    config: {
      overlays
    }
  });
  beginTime = new Date();
  player.load(videoA.value);
  player.addEventListener('loadeddata', setTime);

  if (multiple) {
    playerVideoB = new Player();
    playerVideoC = new Player();
    player.addOneListener('playing', () => {
      // load subsequent players after video player starts
      // load player option 1
      playerVideoB.initialize({
        id: 'videojs-player-videoB',
        autoplay: false,
        config: {}
      });
      playerVideoB.load($('videoB').value);
      playerVideoB.addOneListener('playing', setTime);
    
      // load player option 2
      playerVideoC.initialize({
        id: 'videojs-player-videoC',
        autoplay: false,
        config: {}
      });
      playerVideoC.load($('videoC').value);
      playerVideoC.addOneListener('playing', setTime);

      // trigger custom event to show buttons
      player.trigger('show-options');
    });
  } else {
    player.addOneListener('playing', () => {
      // trigger custom event to show buttons
      player.trigger('show-options');
    });
  }
  
  // overlays - videos B & C after video completes
  const videoBOverlay = $('videoBOverlay');
  const videoCOverlay = $('videoCOverlay');
  videoBOverlay.addEventListener('click', () => {
    beginTime = new Date();
    player.reset();
    if (multiple) {
      $('videojs-player').classList.add('hide');
      $('videojs-player-videoB').classList.remove('hide');
      playerVideoB.play();
    } else {
      player.initialize({
        id: 'videojs-player'
      });
      player.load($('videoB').value);
    }
    
  });
  videoCOverlay.addEventListener('click', () => {
    beginTime = new Date();
    player.reset();
    if (multiple) {
      $('videojs-player').classList.add('hide');
      $('videojs-player-videoC').classList.remove('hide');
      playerVideoC.play();
    } else {
      player.initialize({
        id: 'videojs-player'
      });
      player.load($('videoC').value);
    }
  });
};

// Re-initialize the players when play button pressed
const play = $('play');
play.addEventListener('click', () => {
  $('videojs-player').classList.remove('hide');
  $('videojs-player-videoB').classList.add('hide');
  $('videojs-player-videoC').classList.add('hide');
  initializePlayers();
});

// initialize the players when page loads
initializePlayers();