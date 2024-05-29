import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Album = ({ playTrack }) => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/albums/${albumId}`
        );

        const processedAlbum = {
          ...response.data,
          artists: [
            ...new Set(response.data.artists.map((artist) => artist.pseudonym)),
          ].map((pseudonym) => ({ pseudonym })),
          tracks: response.data.tracks.map((track) => ({
            ...track,
            durationInSeconds: convertDurationToSeconds(track.duration),
          })),
        };

        setAlbum(processedAlbum);
      } catch (error) {
        console.error("Error fetching album data:", error);
      }
    };

    fetchAlbumData();
  }, [albumId]);

  if (!album) {
    return <div>Loading...</div>;
  }

  const totalDuration = album.tracks.reduce(
    (sum, track) => sum + track.durationInSeconds,
    0
  );

  const artists = album.artists.map((artist) => artist.pseudonym).join(", ");
  const artistLabel = album.artists.length === 1 ? "Artist" : "Artists";

  return (
    <div>
      <h1>{album.title}</h1>
      <h3>
        {artistLabel}: <b>{artists}</b>
      </h3>
      <img
        className="albumCoverAlbumImgMaxWidth128"
        src={"../../img/albums/" + album.id + "/" + album.cover_image}
        alt={album.title}
      />
      <h2>Tracks</h2>
      <ul>
        {album.tracks.map((track) => (
          <li key={track.id}>
            <button onClick={() => playTrack(track)}>{track.title}</button>{" "}
            &nbsp;
            {formatTime(track.durationInSeconds)}
          </li>
        ))}
      </ul>
      <p>Total duration: {formatTime(totalDuration)}</p>
    </div>
  );
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const convertDurationToSeconds = (duration) => {
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

export default Album;
