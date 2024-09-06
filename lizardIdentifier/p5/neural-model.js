
// This is a really silly model to get things going
// Idea is the model will take whatever data is coming in, deal with the formats itself
// setExampleData gives an idea of how it should be stored


model = null
labels = ["human", "lizard"];

// This is the data that the model will expect
function setExampleData() {
    dataset = [
        //{ size: 20, class: "human"},
        //{ size: 25, class: "lizard"},
{size: 17.8, class: 'lizard'},
{size: 17.9, class: 'lizard'},
{size: 18.1, class: 'lizard'},
{size: 28.1, class: 'lizard'},
{size: 17.1, class: 'human'},
{size: 17.0, class: 'human'},
{size: 17.1, class: 'human'},
{size: 17.1, class: 'human'},
{size: 14.1, class: 'human'}
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
    dataset.push({size:data[0], class:label})
    console.log(dataset)
}


function trainModel() {
    console.log("Training model!")
    model = createModel()
    dataset.forEach( d => {
        model.addData([d["size"]],[d["class"]])
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
    console.log("Returning: ",(result,result_str))
    console.log("Result: ",result)
    return [result, result_str]
}


function testModel() {
    setExampleData()
    trainModel()

    demo_data = [20,22, 25, 23, 25]
    demo_data.forEach( d => {
        console.log(`${d} => ${classify(d)}`)
    })

}
