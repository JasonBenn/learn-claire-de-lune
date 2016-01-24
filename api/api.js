var express = require('express');
var app = express();
var midiFileParser = require('midi-file-parser');

var file = require('fs').readFileSync('deb_clai.mid', 'binary')
var midi = midiFileParser(file);

app.get('/api/claire', function (req, res) {
  res.send(midi);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})
