Video Transitions
---

This is a sample application using video.js that allows a user to start video A and transition to video B or C by clicking a button on
the video player.  The user has the option to select `multiple` or `single` video players.  If `multiple` is selected, additional players 
will be used to preload videos B and C.  If `single` is selected, one player will be used for videos A, B and C.  The time it takes to load
the video will be displayed to the user to that you can see the difference between preloading videos B and C into separate players vs. waiting
to load the video when the user selects B or C.

---

## npm commands

Commands are defined in `package.json`.

### install

```bash
 $ npm run install
```

Installs dependencies defined in `package.json`.

### sample

```bash
 $ npm run sample
```

Runs the application on [http://localhost:3000/](http://localhost:3000/)
