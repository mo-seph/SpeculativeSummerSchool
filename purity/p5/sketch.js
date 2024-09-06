// To find your model link, go to the teachable machine page. Hit "Export Model", then hit "Upload my model" then wait until it is uploaded, then copy the link under the "Your sharable link" section and paste it in here
const modelURL = "https://teachablemachine.withgoogle.com/models/0fKTsO4rx/";

// These are the classes our model shows. Make sure to update these to match the classes in your model
const classes = ["Sure", "not sure"];

// We will use this to count the amount of times each class is seen.
let count = 0;
let direction = 1;

/*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Make sure to update the variables above before continuing.
********************************/
let classifier;
let video;
let flippedVideo;
let label;
let isSure = false;
let lastTime = 0;

function preload() {
  // Load the image classifier model (a.k.a. the created AI)
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
  createCanvas(640, 260);
  video = createCapture(VIDEO);
  video.size(320, 260);
  video.hide();
  // frameRate(30);
  flippedVideo = ml5.flipImage(video); // Video needs to be flipped
  classifyVideo(); // Capture video and start classifying it.
  lastTime = millis();
}

function draw() {
  if (millis() - lastTime > 3000) {
    // update the counter every second
    if (isSure) {
      count++;
    } else {
      count--;
    }

    if (count > 30) {
      count = 30; // Set to upper limit if it exceeds 30
    } else if (count < -30) {
      count = -30; // Set to lower limit if it exceeds -30
    }
    const r = map(count, -30, 30, 255, 0); // Red decreases from 255 to 0
    const g = map(count, -30, 30, 0, 255); // Green increases from 0 to 255
    background(r, g, 0); // Background color changes from red to green
  }

  fill(255); // If we have a box on video, make the background green. Otherwise make the background red

  image(flippedVideo, 0, 0); // Add the video currently being classified to the left side of the screen

  textSize(16);
  textAlign(CENTER);
  text(label, (3 * width) / 4, height - 4); // Add text with what the AI classifies the video as on the bottom right side of the screen
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove(); //  Make the classifier view the video and call the function "gotResult" with the result.
}

function gotResult(error, results) {
  if (error) {
    // If an error occurs, print it in the console.
    console.error(error);
    return;
  }

  label = String(results[0].label); // This is the result of the AI
  conf = Number(results[0].confidence); // This is the confidence of the AI in the result
  if (label == classes[0]) {
    isSure = true;
  } else {
    isSure = false;
  }
  console.log(`label: ${label}; confidence: ${conf}`);

  classifyVideo(); // Classify the next image in the video.
}
