import React, { useState, useEffect } from "react";
import axios from "axios";

const Upload = () => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    newArtist: false,
    newAlbum: false,
    mp3: null,
    cover: null,
    existingArtists: [],
    existingAlbums: [],
  });

  useEffect(() => {
    fetchExistingArtists();
    fetchExistingAlbums();
  }, []);

  const fetchExistingArtists = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/artists");
      setFormData((prevFormData) => ({
        ...prevFormData,
        existingArtists: response.data,
      }));
    } catch (error) {
      console.error("Error fetching existing artists:", error);
    }
  };

  const fetchExistingAlbums = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/albums");
      setFormData((prevFormData) => ({
        ...prevFormData,
        existingAlbums: response.data,
      }));
    } catch (error) {
      console.error("Error fetching existing albums:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append(
        "artist",
        formData.newArtist
          ? formData.artist
          : formData.existingArtists.find(
              (artist) => artist.name === formData.artist
            ).id
      );
      formDataToSend.append(
        "album",
        formData.newAlbum
          ? formData.album
          : formData.existingAlbums.find(
              (album) => album.title === formData.album
            ).id
      );
      formDataToSend.append("mp3", formData.mp3);
      formDataToSend.append("cover", formData.cover);

      const response = await axios.post(
        "http://localhost:3000/upload",
        formDataToSend
      );
      console.log("Upload successful:", response.data);
      // Do something with the response if needed
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Artist:</label>
        <select
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          disabled={formData.newArtist}
        >
          <option value="">Select artist</option>
          {Array.isArray(formData.existingArtists) &&
            formData.existingArtists.map((artist) => (
              <option key={artist.id} value={artist.name}>
                {artist.name}
              </option>
            ))}
        </select>
        <input
          type="checkbox"
          name="newArtist"
          checked={formData.newArtist}
          onChange={handleChange}
        />{" "}
        New Artist
      </div>
      {formData.newArtist && (
        <div>
          <label>New Artist Name:</label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
          />
        </div>
      )}
      <div>
        <label>Album:</label>
        <select
          name="album"
          value={formData.album}
          onChange={handleChange}
          disabled={formData.newAlbum}
        >
          <option value="">Select album</option>
          {Array.isArray(formData.existingAlbums) &&
            formData.existingAlbums.map((album) => (
              <option key={album.id} value={album.title}>
                {album.title}
              </option>
            ))}
        </select>
        <input
          type="checkbox"
          name="newAlbum"
          checked={formData.newAlbum}
          onChange={handleChange}
        />{" "}
        New Album
      </div>
      {formData.newAlbum && (
        <div>
          <label>New Album Title:</label>
          <input
            type="text"
            name="album"
            value={formData.album}
            onChange={handleChange}
          />
          <label>Album Cover Image:</label>
          <input type="file" name="cover" onChange={handleFileChange} />
        </div>
      )}
      <div>
        <label>mp3 File:</label>
        <input type="file" name="mp3" onChange={handleFileChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default Upload;
