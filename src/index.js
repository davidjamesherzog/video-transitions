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

// switch players when users selects either video B or video C
const switchPlayers = (id, currentPlayer, newPlayer) => {
  beginTime = new Date();
  currentPlayer.reset();
  if (multiple) {
    $('videojs-player').classList.add('hide');
    $(`videojs-player-${id}`).classList.remove('hide');
    newPlayer.play();
  } else {
    currentPlayer.initialize({
      id: 'videojs-player'
    });
    currentPlayer.load($(id).value);
  }
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
  
  // load main player
  const player = new Player();
  player.initialize({
    id: 'videojs-player',
    overlays
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
        autoplay: false
      });
      playerVideoB.load($('videoB').value);
      playerVideoB.addOneListener('playing', setTime);
    
      // load player option 2
      playerVideoC.initialize({
        id: 'videojs-player-videoC',
        autoplay: false
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
  videoBOverlay.addEventListener('click', () => switchPlayers('videoB', player, playerVideoB));
  const videoCOverlay = $('videoCOverlay');
  videoCOverlay.addEventListener('click', () => switchPlayers('videoC', player, playerVideoC));
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