import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Artist = ({ playTrack }) => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const artistResponse = await axios.get(
          `http://localhost:3000/api/artists/${artistId}`
        );
        const songsResponse = await axios.get(
          `http://localhost:3000/api/artists/${artistId}/songs`
        );
        const albumsResponse = await axios.get(
          `http://localhost:3000/api/artists/${artistId}/albums`
        );

        setArtist(artistResponse.data);
        setSongs(songsResponse.data);
        setAlbums(albumsResponse.data);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    fetchArtistData();
  }, [artistId]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{artist.pseudonym}</h1>
      <h2>Songs</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <button onClick={() => playTrack(song)}>{song.title}</button>
          </li>
        ))}
      </ul>
      <h2>Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            <Link to={`/album/${album.id}`}>{album.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Artist;
