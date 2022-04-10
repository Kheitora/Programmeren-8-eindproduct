import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"
import { createChart } from "/scatterplot.js"


//
// DATA
//
const csvFile = "./Data/Heart_Disease_Prediction.csv"
const trainingLabel = "Heart_Disease"  
const ignored = ["Chest_pain_type", "BP", "Cholesterol", "FBS_over_120", "EKG_results", "Slope_of_ST"]
//Age,Sex,Chest_pain_type,BP,Cholesterol,FBS_over_120,EKG_results,Max_HR,Exercise_angina,ST_depression,Slope_of_ST,Number_of_vessels_fluro,Thallium,Heart_Disease
var predictionData = [];

let form = document.getElementById("button")
let decisionTree
let accuracy 
let totalAmount
let amountCorrect = 0
let accuracyhtml = document.getElementById("accuracy")
let predictionhtml = document.getElementById("prediction")

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
             
    })
    
}

if (form){
form.addEventListener("click", () => {
    predict()
})
}

function predict() {
    let age;
    let sex;
    let max;
    let angina;
    let depression;
    let artery;
    let thallium;
    age = document.getElementById("Age").value 
    sex = document.getElementById("Sex").value
    max = document.getElementById("Max").value
    angina = document.getElementById("Angina").value
    depression = document.getElementById("Depression").value
    artery = document.getElementById("Artery").value
    thallium = document.getElementById("Thallium").value
    predictionData.push(age, sex, max, angina, depression, artery, thallium);
    console.log(predictionData)
    showPrediction()
}

function showPrediction(){

    let disease = {Age: predictionData[0] , Sex: predictionData[1], Max_HR: predictionData[2], Exercise_angina: predictionData[3], ST_depression: predictionData[4], Number_of_vessels_fluro: predictionData[5], Thallium: predictionData[6]}
    let prediction = decisionTree.predict(disease)
        
    if(prediction == 1){
        predictionhtml.innerText = "The test indicates there is a heart disease present in your body, a checkup with you doctor is needed"
        alert("The test indicates there is a heart disease present in your body, a checkup with you doctor is needed")
    }else{
        predictionhtml.innerText = "The test indicates there is no heart disease present in your body, we would still recommend you to make an appointment for a checkup, since the algorithm isnt 100% accurate"
        alert("The test indicates there is no heart disease present in your body, we would still recommend you to make an appointment for a checkup, since the algorithm isnt 100% accurate")
    }

    predictionData = []
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    totalAmount = testData.length

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    })

    const columns = data.map(disease => ({
        x: disease.Cholesterol,
        y: disease.Heart_Disease,
    }))
    createChart(columns)

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())
    
    // todo : bereken de accuracy met behulp van alle test data
    for(let diseaseChance of testData) {
        testdisease(diseaseChance)
    }

}

function testdisease(disease) {
        // kopie van passenger maken, zonder het label
        const diseaseWithoutLabel = Object.assign({}, disease)
        delete diseaseWithoutLabel.Heart_Disease

        // prediction
        let prediction = decisionTree.predict(diseaseWithoutLabel)
        

        // vergelijk de prediction met het echte label
        if (prediction == disease.Heart_Disease) {
            amountCorrect++
            accuracy = Math.round(amountCorrect / totalAmount * 100) 
            if(accuracyhtml){
            accuracyhtml.innerText  = (`The Accuracy is ${accuracy}%, this means that 87% of the predictions are correct. 
            A drawing of the decision tree can be found below. This is a drawing that visualizes the steps the algorithm takes to come to the prediction. 
            Even further below that you can find a scatterplot. This visualizes if there is a connection between two datapoints and if so what that connection is.`)}
        }else{
        }
    }



loadData()