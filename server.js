const express = require("express");
const path = require("path");
const uuid = require("uuid").v4;
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./db/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// GET /notes - Should return the notes.html file.
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
  return res.json(db);
});
// POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  newNote.id = uuid();

  db.push(newNote);

  res.json(db);
});
// DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete("/api/notes/:id", function(req, res) {
  for (let i = 0; i < db.length; i++) {
    if (db[i].id === req.params.id) {
      console.log(db[i].id + " is deleted.");
      db.splice(i, i + 1);
      res.json(db);
    }
  }
});

// GET * - Should return the index.html file
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function() {
  console.log("APP listening on PORT " + PORT);
});
