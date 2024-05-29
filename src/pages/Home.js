import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <Link to={`/artist/${artist.id}`}>
              <div>
                <img
                  className="homeArtistImgMaxWidth128"
                  src={
                    "/img/artists/avatars/" +
                    artist.id +
                    "/" +
                    artist.profile_picture
                  }
                  alt={`${artist.pseudonym}`}
                />
                {<h3>{artist.pseudonym}</h3>}
                {/* <p>{artist.description}</p> */}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
