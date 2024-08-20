let serial;

// This variable will hold whatever data is coming from the microcontroller.
let latestData = "waiting for data";
let currentState = "classifying"
let data_to_label = null;
let data_to_classify = null;
let current_classification = null;
let current_label = null;

labels = ["hot", "cold"];

var label_controls;
var classify_controls;

labels = ["hot", "cold"];
dataset = [];



function setupGUI() {
  label_controls = createDiv();
  label_controls.position(0,0)
  lab_class_button = createButton('Classify');
  lab_class_button.position(300,0);
  lab_class_button.parent(label_controls);
  lab_class_button.mouseClicked(()=>{setState("classifying") })
  labels.forEach( (p) => {
    console.log(`Creating button: ${p}`)
    b = createButton(p)
    b.mouseClicked(()=>{doLabel(p)})
    b.parent(label_controls)
  })   
  
  
  classify_controls = createDiv();
  classify_controls.position(0,0)
  class_lab_button = createButton('Label');
  class_lab_button.position(300,0);
  class_lab_button.parent(classify_controls);
  class_lab_button.mouseClicked(()=>{setState("labelling") })

}

function setupSerial() {
   // We create a new serialPort object. This lets us read/write through the Serial connection.
  serial = new p5.SerialPort();

  // We list the available ports and also try opening a connection to the serialPort you specified at the top.
  serial.list();
  serial.open(serialPortName);

  // These next few lines run based on different events, for example when the p5.sketch succesfully connects to the server or the data comes in. We don't have to touch them often. These events are defined in setup, but will always run as long as the sketch is running. They don't have be defined in the draw() function.
  serial.on("connected", serverConnected);
  serial.on("list", gotList);
  serial.on("data", gotSerialData);
  serial.on("error", gotError);
  serial.on("open", gotOpen);
  serial.on("close", gotClose);
}

function setState(st) {
  console.log(`Setting state: ${st}`)
  if( st === "classify") {
    classify_controls.show();
    label_controls.hide();
  }
  if( st === "label") {
    classify_controls.hide();
    label_controls.show();
  }
  currentState = st;
  data_to_classify = null;
  data_to_label = null;
  current_classification = null;
  current_label = null;

}

// The name for your serialPort connection to the ItsyBitsy is shown in the p5.serialcontrol app.
let serialPortName = "/dev/tty.usbmodem1101";

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupSerial();
  setupGUI();
  setState("label")
 
}

function draw() {
  // In this skeleton example, the sketch will only show whatever the incoming data is.
  background(255, 255, 255);
  fill(0, 0, 0);
  if( currentState === "labelling") draw_labelling()
  else if( currentState === "classifying") draw_classifying()
  //text(latestData, 10, 10);
  //text(currentState, 10, 30 );
}

function draw_labelling() {
  background(200, 255, 255)
  text("Labelling!", 10, 60);
  text("> " + str(data_to_label), 10, 80);
  text("is " + str(current_label), 10, 100);

  
}

function draw_classifying() {
  background(255, 200, 255)
  if( current_classification) {
    text(str(current_classification), 10, 100);
  }
  else if( data_to_classify) {
    doClassification();
    text("Classifying!", 10, 60);
    text("> " + str(data_to_classify), 10, 80);
  }
  else {
    //Shouldn't be here...
  }
 

}

function doClassification() {
    if( ! data_to_classify ) return;
    if( data_to_classify > 30 ) {
        print("Got classification of HOT");
        current_classification = "hot"
        data_to_classify = null
    } else {
        print("Got classification of Cold");
        current_classification = "cold"
        data_to_classify = null;
    }
}

function doLabel(l) {
  if( ! data_to_label ) return;
  console.log(`Labelling ${data_to_label} as ${l}`)
  dataset.push([data_to_label,l])
  console.log(dataset)
  current_label = l;
}

// These functions help you debug the serial connection.
function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {

  print(theerror);
}

// This function reads the incoming serial connection. It takes the current line, removes any extra spaces, and saves it to latestData.

function gotSerialData() {
  let currentString = serial.readLine();
  trim(currentString);
  gotData(currentString)
}

function gotData(currentString) {

  // If currentString is empty, this if statement will return "true" and exit the gotData function. Empty variables are 'falsy' values. You can read more about this on this page: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
  if (!currentString) return;
  //console.log(currentString);
  
  sp = currentString.split(":")
  cmd = sp[0];
  data = sp[1];
  if( cmd === "label" ) label(data);
  else if( cmd === "classify") classify(data);
  else if( cmd === "state" ) setState(data);
  else if( cmd === "test") doTest(data);
  else {print(`Unknonwn command: ${cmd}`)}
}

function label(data) {
  print(`going to label data: ${data}`)
  setState("labelling")
  data_to_label = parseData(data)
}
function classify(data) {
  print(`going to classify data: ${data}`)
  data_to_classify = parseData(data)
  print(`Got data: ${data_to_classify}`)
}

function parseData(data) {
  return data.split(" ").map(parseFloat)
}

function doTest(data) {
  //latestData = `Running test number: ${data}`;
}

