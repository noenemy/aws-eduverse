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
