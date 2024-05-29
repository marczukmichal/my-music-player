import React, { useEffect, useRef } from "react";

const AudioPlayer = ({ currentTrack }) => {
  const audioRef = useRef(null);

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (currentTrack) {
      stop();
      audioRef.current.src = `http://localhost:3001/music/${currentTrack.id}.mp3`;
      playTrack();
    }
  }, [currentTrack]);

  return (
    <div className="audio-player">
      {currentTrack ? (
        <div>
          <strong>Now Playing:</strong> {currentTrack.title}
        </div>
      ) : (
        <div>Select a track to play</div>
      )}
      <audio ref={audioRef} controls />
    </div>
  );
};

export default AudioPlayer;
