
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
    means = {"hot":30, "cold":25}
}

// Make sure that this matches whatever model is going to be used
function addTrainingData(data,label) {
    dataset.push({temp:data[0], class:label})
    console.log(dataset)
}


function trainModel() {
    console.log("Training model!")
    model = {}
    labels.forEach(l => {
        values = []
        count = 0;
        sum = 0;
        dataset.forEach(d => { if(d['class'] === l) { count+=1; sum += d['temp']}})
        model[l] = sum / count
    })    
    console.log("Trained Model!")
    console.log(model)
    setState("classify")
}

function classify(data) {
    closest = null;
    distance = Number.MAX_VALUE
    labels.forEach( l => {
        t = model[l]
        d = Math.abs(data- t )
        console.log(`Distance for ${l}=${t} from ${data} is ${d}`)
        if( d < distance ) { closest = l; distance = d}
    })
    return closest
}


function testModel() {
    setExampleData()
    trainModel()

    demo_data = [27, 30, 29.5, 40, 10]
    demo_data.forEach( d => {
        console.log(`${d} => ${classify(d)}`)
    })

}
