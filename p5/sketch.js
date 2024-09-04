let serial;

// This variable will hold whatever data is coming from the microcontroller.
let latestData = "waiting for data";
let currentState = "classifying"
let data_to_label = null;
let current_classification = null;
let current_label = null;
let line_height = 40;


const responses = {
    human : {
        stories: [
            "You are a happy human",
            "You are breathing and making eyecontact like a normal person",
            "Self-awareness is a human trait. Embrace your quirks and stay curious!",
            "If you feel cold in winter, you’re not a lizard",
        ],
        images: [
            "images/person1.webp",
            "images/person2.jpg",
            "images/person3.webp",
        ]
    },
    lizard : {
        stories: [ // > please write a 30 word piece of advice for a lizard person trying to pretend to be human
            "You are a secret lizard person",
            "Hide your tail so they don't notice you. Remember to blink",
            "Blend in by mimicking human expressions, but not too perfectly.",
            "Smile at random; it’s socially expected",
            "Don’t mention eating insects—stick to 'pizza.'",
            "Pretend to find the weather fascinating"
        ],
        images: [
            "images/lizard1.webp",
            "images/lizard2.webp",
            "images/lizard3.jpg"
        ]
    }
}

let classification_label = null;
let classification_story = null;
let classification_image = null;
let classification_text_color = null;

var label_controls;
var classify_controls;

dataset = [];

// Main p5 setup function - called once at the beginning
function setup() {
    createCanvas(windowWidth, windowHeight-30);
    setupSerial();
    setupGUI();
    setState("label")

}

// Main p5 draw function - called every time something happens
function draw() {
    textSize(line_height);
    // In this skeleton example, the sketch will only show whatever the incoming data is.
    background(255, 255, 255);
    fill(0, 0, 0);
    if (currentState === "label") draw_labelling()
    else if (currentState === "classify") draw_classifying()
    else if (currentState === "train") draw_training()
}

// Response to data coming in
function gotData(currentString) {

    // If currentString is empty, this if statement will return "true" and exit the gotData function. Empty variables are 'falsy' values. You can read more about this on this page: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
    if (!currentString) return;
    //console.log(currentString);

    sp = currentString.split(":")
    cmd = sp[0];
    data = sp[1];
    if (cmd === "test") doTest(data);
    else if (cmd === "label") setState("label",data);
    else if (cmd === "classify") setState("classify",data);
    else if (cmd === "state") setState(data, null);
    else { print(`Unknonwn command: ${cmd}`) }
}


function setupGUI() {
    state_controls = createDiv("State: ");
    //state_controls.position(0, 0)
    state_controls.style("background-color", "#8b8b8b");

    class_lab_button = createButton('Label');
    //class_lab_button.position(300, 0);
    class_lab_button.parent(state_controls);
    class_lab_button.mouseClicked(() => { setState("label") })    

    class_lab_button = createButton('Train');
    class_lab_button.parent(state_controls);
    class_lab_button.mouseClicked(() => { setState("train") })    

    state_class_button = createButton('Classify');
    state_class_button.parent(state_controls);
    state_class_button.mouseClicked(() => { setState("classify") })

    state_class_button = createButton('Example');
    state_class_button.parent(state_controls);
    state_class_button.mouseClicked(() => { doExample() })

    label_controls = createDiv();
    label_controls.position(0, 0)
    labels.forEach((p) => {
        console.log(`Creating button: ${p}`)
        b = createButton(p)
        b.mouseClicked(() => { doLabel(p) })
        b.parent(label_controls)
    })


}



function setState(st, data=null) {
    console.log(`Setting state: ${st}`)
    data_to_label = null;
    current_classification = null;
    current_label = null;
    classification_label = null;
    classification_story = null;
    classification_image = null;
    classification_text_color = null;

    if (st === "classify") {
        label_controls.hide();
        if( data ) doClassification( parseData(data) )
    }
    if (st === "label") {
        label_controls.show();
        if( data ) data_to_label = parseData(data)
    }
    if (st === "train" ) {
        label_controls.hide();
        doTraining();
    }
    currentState = st;

}




function draw_labelling() {
    background(200, 255, 255)
    text(`Labelling! ${data_to_label || "<no data yet>"} is ${current_label || "<no label yet>"}`, 10, 2*line_height);
    textSize(line_height/4);
    s = dataset.map(d => JSON.stringify(d)).join("\n")
    text(`Dataset:\n${s}`,20,3*line_height)
    textSize(line_height);

}

function draw_classifying() {
    background(255, 200, 255)
    if( ! model ) {
        text("Train the model before classifying!", 10, 2*line_height);
    } else if (!current_classification) {
        text("Waiting for data", 10, 2*line_height);
    }
    else  { // Really draw the classification
        //print("Loading image: ",classification_image)
        //image( loadImage(classification_image),0,0, windowWidth, windowHeight)
        image( classification_image,0,0, windowWidth, windowHeight)
        //fill(classification_text_color)
        fill(0)
        stroke(255)
        strokeWeight(5)
        text(classification_label, 10, 2*line_height)
        textSize(line_height/2)
        text(classification_story, 10, 4*line_height, 200)
        text(str(current_classification), 10, windowHeight - 2*line_height);
        stroke(0)
        strokeWeight(1)
    }
}


function draw_training() {
    background(255, 255, 200)
    text("Training!", 10, 2*line_height);

}



function doLabel(l) {
    if (!data_to_label) return;
    console.log(`Labelling ${data_to_label} as ${l}`)
    addTrainingData(data_to_label, l)
    current_label = l;
}

function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

async function doClassification(data) {
    if (!model) {
        alert("Need to train the model first!")
        return
    }
    var [label_obj,label_str] = await classify(data);
    label = label_str
    console.log(`Got classification for ${data} of ${label}`);
    console.log(label_obj)
    classification_label = label_obj[0]['label'] // Get the label of the most probable class
    console.log(`Classification ID:`, classification_label)
    console.log(`Responses:`,responses[classification_label])
    classification_story = randChoice( responses[classification_label]['stories'] )
    classification_image = loadImage( randChoice( responses[classification_label]['images'] ) )
    current_classification = label
}

function doTraining() {
    console.log("Starting to train model")
    model = null;
    trainModel();
}

function doExample() {
    setExampleData();
    doTraining();
}

function parseData(data) {
    return data.split(" ").map(parseFloat)
}

function doTest(data) {
    //latestData = `Running test number: ${data}`;
}

