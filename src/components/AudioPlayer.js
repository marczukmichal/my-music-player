import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const AudioPlayer = ({ currentTrack }) => {
  const audioRef = useRef(null);
  const [album, setAlbum] = useState(null); // Add this line to define the album state

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
    const fetchAlbumData = async () => {
      if (currentTrack && currentTrack.album_id) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/albums/${currentTrack.album_id}`
          );
          setAlbum(response.data);
        } catch (error) {
          console.error("Error fetching album data:", error);
        }
      }
    };

    if (currentTrack) {
      stop();
      audioRef.current.src = `http://localhost:3001/music/${currentTrack.id}.mp3`;
      playTrack();
      fetchAlbumData();
    }
  }, [currentTrack]);

  return (
    <div className="audio-player">
      {currentTrack ? (
        <div>
          <img
            className="songCoverBottomPlayerMaxWidth64"
            src={`../../img/albums/${currentTrack.album.id}/${currentTrack.album.cover_image}`}
            alt={currentTrack.album.title}
          />
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
