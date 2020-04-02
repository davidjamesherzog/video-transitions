export default class Player {
  constructor() {
    this._video = null;
  }

  get video() {
    return this._video;
  }

  initialize({id = '', overlays = [], autoplay = true}) {
    if (videojs.getPlayers()[id]) {
      delete videojs.getPlayers()[id];
    }

    this._video = videojs(id, {
      autoplay: autoplay,
      techOrder: ['html5']
    });

    // add overlays
    this._video.overlay({
      overlays
    });
  }

  load(url) {
    this._video.src([{
      //type: 'video/mp4',
      type: 'application/x-mpegURL',
      src: url
    }]);
  }

  play() {
    this._video.play();
  }

  reset() {
    this._video.reset();
    this._video.currentTime(0);
    this._video.hasStarted(false);
  }

  addEventListener(event, callback) {
    this._video.on(event, callback);
  }

  addOneListener(event, callback) {
    this._video.one(event, callback);
  }

  trigger(event) {
    this._video.trigger(event);
  }

}