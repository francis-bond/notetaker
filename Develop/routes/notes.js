const notes = require('express').Router();
const uuid = require('../helpers/uuid');
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils")

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile(require('path').resolve(__dirname, '../db/db.json')).then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        readAndAppend(newNote, require('path').resolve(__dirname, '../db/db.json'));
        res.json(`Note added successfully 🚀`);
    } else {
        res.error('Error in adding Note');
    }
});

notes.delete('/:note_id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const noteId = req.params.note_id;
    readFromFile(require('path').resolve(__dirname, '../db/db.json'))
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id !== noteId);
      writeToFile(require('path').resolve(__dirname, '../db/db.json'), result);
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});
module.exports = notes;