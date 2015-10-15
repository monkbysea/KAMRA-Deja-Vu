// Requires
require("babel/polyfill");
const Stats = require("stats.js");
const aspectFit = require("./scripts/layout.js").aspectFit;
const MidiDispatcher = require("./scripts/MidiDispatcher.js");
const MidiNoteView = require("./scripts/MidiNoteView.js");
const checks = require("./scripts/checks.js");
const findFace = require("./scripts/find_face.js");

const effect = require("./scripts/deform/index.js"); // 顔をひずめる
//const effect = require("./scripts/fukuwarai/index.js"); // 顔のパーツを移動する


// setup MIDI
const audio = document.getElementById("songAudio");
const midiDispatcher = new MidiDispatcher(audio, "sounds/dejavu1.mid", 110);
const midiNoteView = new MidiNoteView("keyboards");

// setup Video
const video = document.getElementById('videoel');
const ctrack = new clm.tracker();
ctrack.init(pModel);

checks.requestWebcam(video, success=>{
  findFace.start(video, ctrack, onFaceFound);
});

midiDispatcher.addListener("midi", (data) => {
  effect.onMidi(data);
  midiNoteView.onMidi(data);
});

function onFaceFound() {
  effect.start(video, ctrack);
}


// Aspect fit
{
  for(let targetID of ['videoel','overlay','webgl']) {
    aspectFit(targetID, 4/3);
  }
}

// Stats
{
  let stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.getElementById('container').appendChild( stats.domElement );

  document.addEventListener("clmtrackrIteration", function(event) {
    stats.update();
  }, false);
}

