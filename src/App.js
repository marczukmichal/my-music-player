import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Layout from "./components/Layout";
import Artist from "./components/Artist";
import Album from "./components/Album";
import AudioPlayer from "./components/AudioPlayer";

const App = () => {
  const [currentTrack, setCurrentTrack] = useState(null);

  const playTrack = (track) => {
    setCurrentTrack(track);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/artist/:artistId"
            element={<Artist playTrack={playTrack} />}
          />
          <Route
            path="/album/:albumId"
            element={<Album playTrack={playTrack} />}
          />
        </Routes>
        <div style={{ position: "fixed", bottom: 0, width: "100%" }}>
          <AudioPlayer currentTrack={currentTrack} />
        </div>
      </Layout>
    </Router>
  );
};

export default App;
