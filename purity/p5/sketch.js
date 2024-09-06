// SERIAL CONNECTION VARIABLES
let serial;
let latestData = "waiting for data";

// TEACHABLE MACHINE VARIABLES

// const modelURL = "https://teachablemachine.withgoogle.com/models/0fKTsO4rx/"; // This is the model made by the team
const modelURL = "https://teachablemachine.withgoogle.com/models/YRVeU9S7S/"; // this is my model for testing

const classes = ["empty", "object"];
let counter = 0;
let classifier;
let video;
let flippedVideo;
let label;
let conf;
// let isSure = false;
const incrementVal = 0.01;
let lastTime = 0;
let prevRGB = "";
let activeRGB = "";

function preload() {
  // Load the image classifier model (a.k.a. the created AI)
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
  createCanvas(640, 260);
  video = createCapture(VIDEO);
  video.size(320, 260);
  video.hide();
  setupSerial();
  frameRate(30);
  flippedVideo = ml5.flipImage(video); // Video needs to be flipped
  classifyVideo(); // Capture video and start classifying it.
  lastTime = millis();
  background(0);
}

function draw() {
  // update the counter every frame
  if (label == "object" && conf > 0.9) {
    counter += incrementVal;
  } else {
    counter -= incrementVal;
  }

  if (counter > 1) {
    counter = 1; // Set to upper limit if it exceeds 1
  }
  if (counter < 0) {
    counter = 0; // Set to lower limit if it exceeds 0
  }

  // TODO - every second update the background color based on the counter
  if (millis() - lastTime > 1000) {
    let r = map(counter, 0, 1, 255, 0); // Red decreases from 255 to 0
    let g = 0; // Green stays 0
    let b = map(counter, 0, 1, 0, 255); // Blue increases from 0 to 255
    let rgb = [floor(r), floor(g), floor(b)];
    activeRGB = rgb.join(":");
    if (prevRGB !== activeRGB) {
      console.log(`An updated color: ${activeRGB}`);
      serial.write(activeRGB + "\n"); // Write the colorCode to the
      background(rgb[0], rgb[1], rgb[2]);
    }

    lastTime = millis();
    prevRGB = activeRGB;
  }

  fill(255);
  image(flippedVideo, 0, 0);
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = String(results[0].label);
  conf = Number(results[0].confidence);

  classifyVideo();
}

function gotData(currentString) {
  // If currentString is empty, this if statement will return "true" and exit the gotData function. Empty variables are 'falsy' values. You can read more about this on this page: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
  if (!currentString) return;
  //console.log(currentString);
  console.log(`${currentString}`);
}
