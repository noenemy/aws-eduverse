// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState, useEffect } from 'react';

// Styles
import './VideoPlayer.css';

const VideoPlayer = (props) => {
  const maxMetaData = 10;
  const mediaUrl = props.url;
  //const [ mediaUrl, setMediaUrl] = useState();

  useEffect(() => {
    //setMediaUrl(props.url);

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
          console.log("Player State - READY");
      });
      player.addEventListener(PlayerEventType.ERROR, (err) => {
          console.warn("Player Event - ERROR:", err);
      });
      player.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {
          console.log('Timed metadata: ', cue.text);
          const metadataText = JSON.parse(cue.text);
          const productId = metadataText['productId'];
          const metadataTime = player.getPosition().toFixed(2);
  
          // only keep max 5 metadata records
          if (metaData.length > maxMetaData) {
            metaData.length = maxMetaData;
          }
          // insert new metadata
          metaData.unshift(`productId: ${productId} (${metadataTime}s)`);
      });
  
      // Setup stream and play
      player.setAutoplay(true);
      console.log("@player load > " + mediaUrl);
      player.load(mediaUrl);
      player.setVolume(0.5);
    }
    const mediaPlayerScript = document.createElement("script");
    mediaPlayerScript.src = "https://player.live-video.net/1.2.0/amazon-ivs-player.min.js";
    mediaPlayerScript.async = true;
    mediaPlayerScript.onload = () => mediaPlayerScriptLoaded();
    document.body.appendChild(mediaPlayerScript);
  }, []);
  
  return (

    <div className="player-wrapper">
      <div className="aspect-169 pos-relative full-width full-height">
        <video id="video-player" className="video-elem pos-absolute full-width"
         autoPlay controls playsInline muted></video>
         <div>{mediaUrl}</div>
      </div>
    </div>
    
  )
}

export default VideoPlayer;
