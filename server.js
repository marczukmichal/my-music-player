const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors()); // Dodanie obsługi CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  next();
});

const port = 3000;

// Utwórz połączenie z bazą danych
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "music_app",
});

// Połącz się z bazą danych
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Konfiguracja multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "mp3") {
      cb(null, "public/music/");
    } else if (file.fieldname === "cover") {
      cb(null, "public/img/albums/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
app.post(
  "/upload",
  upload.fields([{ name: "mp3" }, { name: "cover" }]),
  (req, res) => {
    const { songId, isNewAlbum } = req.body;
    const coverImage = req.files["cover"][0].path;

    if (isNewAlbum === "true") {
      // Wstaw nowy album
      const query = "INSERT INTO albums (title, cover_image) VALUES (?, ?)";
      connection.query(query, [songId, coverImage], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        res.json({
          message: "New album created and cover image uploaded successfully",
        });
      });
    } else {
      // Zaktualizuj istniejący album
      const query = "UPDATE albums SET cover_image = ? WHERE id = ?";
      connection.query(query, [coverImage, songId], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        res.json({
          message:
            "Cover image uploaded and associated with album successfully",
        });
      });
    }
  }
);
// Utwórz endpoint GET dla albumu
app.get("/api/albums/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  const query = `
  SELECT 
    a.id, 
    a.title, 
    a.cover_image, 
    a.release_date, 
    a.created_at, 
    s.id AS song_id, 
    s.title AS song_title,
    s.duration AS song_duration,
    ar.pseudonym AS artist_pseudonym
  FROM albums a
  JOIN album_artists aa ON a.id = aa.album_id
  JOIN songs s ON a.id = s.album_id
  JOIN song_artists sa ON s.id = sa.song_id
  JOIN artists ar ON sa.artist_id = ar.id
  WHERE a.id = ?
`;

  connection.query(query, [albumId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Sprawdzenie czy wyniki zapytania są zdefiniowane
    if (!results || results.length === 0) {
      res.status(404).json({ error: "Album not found" });
      return;
    }

    // Przetwarzanie wyników zapytania
    const album = {
      id: results[0].id,
      title: results[0].title,
      cover_image: results[0].cover_image,
      release_date: results[0].release_date,
      created_at: results[0].created_at,
      artists: results.map((result) => ({
        pseudonym: result.artist_pseudonym,
      })),
      tracks: results.map((result) => ({
        id: result.song_id,
        title: result.song_title,
        duration: result.song_duration,
      })),
    };

    res.json(album);
  });
});

/// dla wsyzstkich albumow

// Utwórz endpoint GET dla albumu
app.get("/api/albums/", (req, res) => {
  const albumId = req.params.albumId;
  const query = `
  SELECT 
    a.id, 
    a.title, 
    a.cover_image, 
    a.release_date, 
    a.created_at, 
    s.id AS song_id, 
    s.title AS song_title,
    s.duration AS song_duration,
    ar.pseudonym AS artist_pseudonym
  FROM albums a
  JOIN album_artists aa ON a.id = aa.album_id
  JOIN songs s ON a.id = s.album_id
  JOIN song_artists sa ON s.id = sa.song_id
  JOIN artists ar ON sa.artist_id = ar.id
 
`;

  connection.query(query, [albumId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    // Sprawdzenie czy wyniki zapytania są zdefiniowane
    if (!results || results.length === 0) {
      res.status(404).json({ error: "Album not found" });
      return;
    }

    // Przetwarzanie wyników zapytania
    const album = {
      id: results[0].id,
      title: results[0].title,
      cover_image: results[0].cover_image,
      release_date: results[0].release_date,
      created_at: results[0].created_at,
      artists: results.map((result) => ({
        pseudonym: result.artist_pseudonym,
      })),
      tracks: results.map((result) => ({
        id: result.song_id,
        title: result.song_title,
        duration: result.song_duration,
      })),
    };

    res.json(album);
  });
});

//okladka albumu endpoint
app.get("/api/tracks/:trackId", (req, res) => {
  const trackId = req.params.trackId;
  const query = `
    SELECT 
      s.id AS song_id, 
      s.title AS song_title,
      s.duration AS song_duration,
      a.id AS album_id, 
      a.title AS album_title, 
      a.cover_image AS album_cover_image
    FROM songs s
    JOIN albums a ON s.album_id = a.id
    WHERE s.id = ?
  `;

  connection.query(query, [trackId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    if (!results || results.length === 0) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    const track = {
      id: results[0].song_id,
      title: results[0].song_title,
      duration: results[0].song_duration,
      album: {
        id: results[0].album_id,
        title: results[0].album_title,
        cover_image: results[0].album_cover_image,
      },
    };

    res.json(track);
  });
});

// Utwórz endpoint GET dla albumu danego artysty

app.get("/api/artists/:artistId/albums", (req, res) => {
  const artistId = req.params.artistId;
  const query = `
    SELECT a.id, a.title, a.cover_image, a.release_date, a.created_at
    FROM albums a
    JOIN album_artists aa ON a.id = aa.album_id
    WHERE aa.artist_id = ?
  `;

  connection.query(query, [artistId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});
// Utwórz endpoint GET dla pojedynczego artysty
app.get("/api/artists/:artistId", (req, res) => {
  const artistId = req.params.artistId;
  const query = "SELECT * FROM artists WHERE id = ?";

  connection.query(query, [artistId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Artist not found" });
      return;
    }
    res.json(results[0]);
  });
});

// Utwórz endpoint GET dla utworów danego artysty
app.get("/api/artists/:artistId/songs", (req, res) => {
  const artistId = req.params.artistId;
  const query = `
    SELECT songs.id, songs.title, songs.duration, songs.created_at
    FROM songs
    INNER JOIN song_artists ON songs.id = song_artists.song_id
    WHERE song_artists.artist_id = ?
  `;

  connection.query(query, [artistId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

// Utwórz endpoint GET dla artystów
app.get("/api/artists", (req, res) => {
  const query = "SELECT * FROM artists";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results);
  });
});

// Nasłuchuj na określonym porcie
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
