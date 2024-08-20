
// This is a really silly model to get things going
// Idea is the model will take whatever data is coming in, deal with the formats itself
// setExampleData gives an idea of how it should be stored


model = null
labels = ["hot", "cold"];

// This is the data that the model will expect
function setExampleData() {
    dataset = [
        { temp: 27, class: "cold"},
        { temp: 24, class: "cold"},
        { temp: 25, class: "cold"},
        { temp: 23, class: "cold"},
        { temp: 30, class: "hot"},
        { temp: 32, class: "hot"},
        { temp: 31, class: "hot"},
        { temp: 29, class: "hot"}
    ]
}

function createModel() {
    ml5.setBackend("webgl");
      // Set the options for the neural network
    let options = {
        task: "classification",
        debug: true,
    };
    classifier = ml5.neuralNetwork(options);
    return classifier;
}

// Make sure that this matches whatever model is going to be used
function addTrainingData(data,label) {
    dataset.push({temp:data[0], class:label})
    console.log(dataset)
}


function trainModel() {
    console.log("Training model!")
    model = createModel()
    dataset.forEach( d => {
        model.addData([d["temp"]],[d["class"]])
    })
    model.normalizeData()
    console.log("Trained Model!")
    console.log(model)

    const trainingOptions = {
        epochs: 32,
        batchSize: 12,
      };
    
    model.train(trainingOptions, () => setState("classify"))
}

async function classify(data) {
    console.log(`Classifying: ${data}`)
    result = await model.classify([data])
    print(`Got async: ${result}`)
    console.log(result)
    result_str = result.map(r => `${r['label']}:${r['confidence'].toPrecision(3)}`).join(", ")
    console.log(result_str)
    return result_str
}


function testModel() {
    setExampleData()
    trainModel()

    demo_data = [27, 30, 29.5, 40, 10]
    demo_data.forEach( d => {
        console.log(`${d} => ${classify(d)}`)
    })

}
