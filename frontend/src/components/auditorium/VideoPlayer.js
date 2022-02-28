import React, { useState, useEffect } from 'react';

// Styles
import './VideoPlayer.css';

const VideoPlayer = (props) => {
  const maxMetaData = 10;
  const mediaUrl = props.url;

  useEffect(() => {
    const videoPlayer = document.getElementById("video-player");
    const quizEl = document.getElementById("quiz");
    const waitMessage = document.getElementById("waiting");
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const cardInnerEl = document.getElementById("card-inner");

    const playerOverlay = document.getElementById("overlay");
    const playerControls = document.getElementById("player-controls");
    const btnPlay = document.getElementById("play");
    const btnMute = document.getElementById("mute");
    const btnSettings = document.getElementById("settings");
    const settingsMenu = document.getElementById("settings-menu");

    // Btn icons
    let setBtnPaused = function(){
      btnPlay.classList.remove("btn--play");
      btnPlay.classList.add("btn--pause");
    };

    let setBtnPlay = function(){
      btnPlay.classList.add("btn--play");
      btnPlay.classList.remove("btn--pause");
    };

    let setBtnMute = function(){
      btnMute.classList.remove("btn--mute");
      btnMute.classList.add("btn--unmute");
    };

    let setBtnUnmute = function(){
      btnMute.classList.add("btn--mute");
      btnMute.classList.remove("btn--unmute");
    };

    let metaData = []
    const mediaPlayerScriptLoaded = () => {
      // This shows how to include the Amazon IVS Player with a script tag from our CDN
      // If self hosting, you may not be able to use the create() method since it requires
      // that file names do not change and are all hosted from the same directory.
  
      const MediaPlayerPackage = window.IVSPlayer;
  
      // First, check if the browser supports the Amazon IVS player.
      if (!MediaPlayerPackage.isPlayerSupported) {
          console.warn("The current browser does not support the Amazon IVS player.");
          return;
      }
  
      const PlayerState = MediaPlayerPackage.PlayerState;
      const PlayerEventType = MediaPlayerPackage.PlayerEventType;
  
      // Initialize player
      const player = MediaPlayerPackage.create();
      player.attachHTMLVideoElement(document.getElementById("video-player"));
  
      // Attach event listeners
      player.addEventListener(PlayerState.PLAYING, () => {
          console.log("Player State - PLAYING");
      });
      player.addEventListener(PlayerState.ENDED, () => {
          console.log("Player State - ENDED");
      });
      player.addEventListener(PlayerState.READY, () => {
          //console.log("Player State - READY");
      });
      player.addEventListener(PlayerEventType.ERROR, (err) => {
          console.warn("Player Event - ERROR:", err);
      });
      player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {

        const metadataText = cue.text;
        const position = player.getPosition().toFixed(2);
        console.log(
          `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
        );
        triggerQuiz(metadataText);
      });

      player.addEventListener(PlayerEventType.AUDIO_BLOCKED, function(){
        setBtnMute();
      });

      // Show/Hide player controls
      playerOverlay.addEventListener(
        "mouseover",
        function (e) {
          playerOverlay.classList.add("player--hover");
        },
        false
      );
      playerOverlay.addEventListener("mouseout", function (e) {
        playerOverlay.classList.remove("player--hover");
      });


      // Controls events
      // Play/Pause
      btnPlay.addEventListener(
        "click",
        function (e) {
          if (btnPlay.classList.contains("btn--play")) {
            // change to pause
            setBtnPaused();
            player.pause();
          } else {
            // change to play
            setBtnPlay();
            player.play();
          }
        },
        false
      );

      // Mute/Unmute
      btnMute.addEventListener(
        "click",
        function (e) {
          if (btnMute.classList.contains("btn--mute")) {
            setBtnMute();
            player.setMuted(1);
          } else {
            setBtnUnmute();
            player.setMuted(0);
          }
        },
        false
      );

      // Create Quality Options
      let createQualityOptions = function (obj, i) {
        let q = document.createElement("a");
        let qText = document.createTextNode(obj.name);
        settingsMenu.appendChild(q);
        q.classList.add("settings-menu-item");
        q.appendChild(qText);

        q.addEventListener("click", (event) => {
          player.setQuality(obj);
          closeSettingsMenu();
          return false;
        });
      };

      // Close Settings menu
      let closeSettingsMenu = function () {
        btnSettings.classList.remove("btn--settings-on");
        btnSettings.classList.add("btn--settings-off");
        settingsMenu.classList.remove("open");
      };

      // Settings
      btnSettings.addEventListener(
        "click",
        function (e) {
          let qualities = player.getQualities();
          let currentQuality = player.getQuality();

          // Empty Settings menu
          while (settingsMenu.firstChild)
            settingsMenu.removeChild(settingsMenu.firstChild);

          if (btnSettings.classList.contains("btn--settings-off")) {
            for (var i = 0; i < qualities.length; i++) {
              createQualityOptions(qualities[i], i);
            }
            btnSettings.classList.remove("btn--settings-off");
            btnSettings.classList.add("btn--settings-on");
            settingsMenu.classList.add("open");
          } else {
            closeSettingsMenu();
          }
        },
        false
      );

      // Close Settings menu if user clicks outside the player
      window.addEventListener("click", function (e) {
        if (playerOverlay.contains(e.target)) {
        } else {
          closeSettingsMenu();
        }
      });

    // Remove card
    function removeCard() {
      quizEl.classList.toggle("drop");
    }

    // Trigger quiz
    function triggerQuiz(metadataText) {
      let obj = JSON.parse(metadataText);

      quizEl.style.display = "";
      quizEl.classList.remove("drop");
      waitMessage.style.display = "none";
      cardInnerEl.style.display = "none";
      cardInnerEl.style.pointerEvents = "auto";

      while (answersEl.firstChild) answersEl.removeChild(answersEl.firstChild);
      questionEl.textContent = obj.question;

      let createAnswers = function (obj, i) {
        let q = document.createElement("a");
        let qText = document.createTextNode(obj.answers[i]);
        answersEl.appendChild(q);
        q.classList.add("answer");
        q.appendChild(qText);

        q.addEventListener("click", (event) => {
          cardInnerEl.style.pointerEvents = "none";
          if (q.textContent === obj.answers[obj.correctIndex]) {
            q.classList.toggle("correct");
          } else {
            q.classList.toggle("wrong");
          }
          setTimeout(function () {
            removeCard();
            waitMessage.style.display = "";
          }, 1050);
          return false;
        });
      };

      for (var i = 0; i < obj.answers.length; i++) {
        createAnswers(obj, i);
      }
      cardInnerEl.style.display = "";
    }
  
      // Setup stream and play
      player.setAutoplay(true);
      console.log("@player load > " + mediaUrl);
      player.load(mediaUrl);
      player.setVolume(0.5);
    }
    const mediaPlayerScript = document.createElement("script");
    mediaPlayerScript.src = "https://player.live-video.net/1.7.0/amazon-ivs-player.min.js";
    mediaPlayerScript.async = true;
    mediaPlayerScript.onload = () => mediaPlayerScriptLoaded();
    document.body.appendChild(mediaPlayerScript);
  }, []);
  
  return (

    <div>
      <div className="inner">
        <div className="player-wrapper">
          <div className="aspect-spacer"></div>
          <div className="pos-absolute full-width full-height top-0">
            <div id="overlay">
            <div id="player-controls">
              <div className="player-controls__inner">
                <button id="play" className="btn btn--icon btn--play">
                  <svg
                    className="icon icon--play"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewbox="0 0 24 24"
                    width="24">
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                  </svg>
                  <svg
                    className="icon icon--pause"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewbox="0 0 24 24"
                    width="24">
                    <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
                  </svg>
                </button>
                <button id="mute" className="btn btn--icon btn--mute">
                  <svg
                    className="icon icon--volume_up"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewbox="0 0 24 24"
                    width="24">
                    <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
                  </svg>
                  <svg
                    className="icon icon--volume_off"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewbox="0 0 24 24"
                    width="24">
                    <path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                  </svg>
                </button>
                <button id="settings" className="btn btn--icon btn--settings-off">
                  <svg
                    className="icon icon--settings"
                    height="24"
                    viewbox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="m0 0h24v24h-24z" fill="none" />
                    <path d="m19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65c-.03-.24-.24-.42-.49-.42h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64zm-7.43 2.52c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
                  </svg>
                </button>
              </div>
            </div>
            <div id="settings-menu"></div>
          </div>
            <video id="video-player" className="el-player" playsInline></video>
          </div>
        </div>

        <div className="quiz-wrap">
          <div id="waiting">
            <span className="waiting-text float"
              >Waiting for the next question</span>
          </div>
          <div id="quiz" className="ivs-card drop">
            <div id="card-inner">
              <h2 id="question"></h2>
              <div id="answers"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default VideoPlayer;
