// SERIAL CONNECTION VARIABLES
let serial;
let latestData = "waiting for data";
let prevRGB = "";
let activeRGB = "";
let colors = ["255:0:0", "0:255:0", "0:0:255"];
let counter = 0;

function setup() {
  createCanvas(640, 260);
  setupSerial();
  frameRate(30);
  lastTime = millis();
  background(0);
}

function draw() {
  // TODO - every second update the background color based on the counter
  if (millis() - lastTime > 1000) {
    counter++;
    lastTime = millis();
    activeRGB = colors[counter % 3];

    if (activeRGB != prevRGB) {
      console.log("color changed. sending to serial");
      rgb = activeRGB.split(":");
      background(rgb[0], rgb[1], rgb[2]);
      serial.write(activeRGB);
    }
    prevRGB = activeRGB;
  }

  fill(255);
}

function gotData(currentString) {
  // If currentString is empty, this if statement will return "true" and exit the gotData function. Empty variables are 'falsy' values. You can read more about this on this page: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
  if (!currentString) return;
  //console.log(currentString);
  console.log(`${currentString}`);
}
