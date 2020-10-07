let mydata;
let unqDistricts;
let unqDS;
let dataReady = false;
let startLetter = 0;
let passVariable = "Baglung";
let rectData = [];

window.addEventListener('load', function () {
    fetch('http://127.0.0.1:5500/nepalmigration.json')
        //fetch('http://api.open-notify.org/astros.json')
        .then(response => response.json())
        .then(data => {
            mydata = data.internalmigration;
            unqDistricts = [...new Set(mydata.map(x => x.District))]; //get a set of unique districts
            let distStart = unqDistricts.map(function (unqDistricts) {
                return unqDistricts[0];
            })
            unqDS = [... new Set(distStart.map(x => x))];
            createGridData();
            let allAge = rectData.filter(x => x.AgeGroup == "All Ages");
            dataReady = true;
            //console.log(allAge.filter(x => x.District == "Baglung"));
            console.log(rectData.length);
            console.log(rectData.filter(x => x.District == "Bhaktapur"));
        })
});

function setup() {
    let myCanvas = createCanvas(200, 400);
    myCanvas.parent("canvas");
    let i = 0;
    let displayDiv = document.getElementById("test");
    let displayTest = document.createElement("p");
    displayTest.innerHTML = "test";
    displayDiv.appendChild(displayTest);
}

function draw() {
    clear();
    background("black");
    fill('white');
    textSize(60);

    if (dataReady) {
        let downPosition = 100;
        textAlign(CENTER);
        text(unqDS[startLetter], 100, downPosition);
        textAlign(LEFT);
        textSize(10);
        downPosition += 100;
        let t = unqDistricts.filter(x => x[0] == unqDS[startLetter]);
        t.forEach(function (x) {
            let link = createA("index.html?district=" + x, x, "_blank");
            link.position(110, downPosition);

            rectMode(RADIUS);
            let migP = rectData.filter(rectData => rectData.District == x && rectData.AgeGroup == "All Ages");
            fill("red");
            rect(100-migP[0].MigrationPercentage, downPosition-70, migP[0].MigrationPercentage, 5);
            fill("white");
            rect(0, downPosition - 70, 100 - migP[0].MigrationPercentage, 5);
            downPosition += 20;
        });
    }
}

function keyPressed() {
    startLetter++;
    if (startLetter >= unqDS.length) {
        return startLetter = 0;
    }
}

function createGridData() {
    let rowData = [... new Set(mydata.map(x => x.Age_Group))];

    //set dynamic row elements
    for (j = 0; j < unqDistricts.length; j++) {
        let distData = mydata.filter(x => x.District == unqDistricts[j]);
        maleTotalPopulation = 0;
        femaleTotalPopulation = 0;
        allTotalPopulation = 0;
        maleMigrantPopulation = 0;
        femaleMigrantPopulation = 0;
        allMigrantPopulation = 0;


        console.log(unqDistricts[j]);
        for (i = 0; i < rowData.length; i++) {
            let maleTot = distData.filter(distData => distData.Gender === "Male" && distData.Age_Group === rowData[i] && distData.Indicator === "Total Population");
            let femaleTot = distData.filter(distData => distData.Gender === "Female" && distData.Age_Group === rowData[i] && distData.Indicator === "Total Population");
            let maleRN = distData.filter(distData => distData.Gender === "Male" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Rural");
            let maleUN = distData.filter(distData => distData.Gender === "Male" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Urban");
            let maleSN = distData.filter(distData => distData.Gender === "Male" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Not stated");
            let allMale = maleRN[0].Value + maleUN[0].Value + maleSN[0].Value;

            let femaleRN = distData.filter(distData => distData.Gender === "Female" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Rural");
            let femaleUN = distData.filter(distData => distData.Gender === "Female" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Urban");
            let femaleSN = distData.filter(distData => distData.Gender === "Female" && distData.Age_Group === rowData[i] && distData.Indicator === "Native born" && distData.Sub_Indicator === "Born in other district" && distData.Sub_Indicator_1 === "Not stated");
            let allFemale = femaleRN[0].Value + femaleUN[0].Value + femaleSN[0].Value;

            maleTotalPopulation += maleTot[0].Value;
            maleMigrantPopulation += allMale;
            femaleTotalPopulation += femaleTot[0].Value;
            femaleMigrantPopulation += allFemale;
            let rowTot = femaleTot[0].Value + maleTot[0].Value;

            let totalObj = new Object();
            totalObj.District = unqDistricts[j];
            totalObj.AgeGroup = rowData[i];
            totalObj.MaleValue = maleTot[0].Value;
            totalObj.FemaleValue = femaleTot[0].Value;
            totalObj.TotalValue = rowTot;

            let migrationObject = new Object();
            migrationObject.District = unqDistricts[j];
            migrationObject.AgeGroup = rowData[i];
            migrationObject.MaleValue = allMale;
            migrationObject.FemaleValue = allFemale;
            migrationObject.TotalValue = allMale + allFemale;

            let mainObject = new Object();
            mainObject.District = unqDistricts[j];
            mainObject.AgeGroup = rowData[i];
            mainObject.PopTotal = totalObj;
            mainObject.MigrationTotal = migrationObject;
            mainObject.MigrationPercentage = ((allMale + allFemale) / rowTot) * 100;

            //console.log(mainObject);
            rectData.push(mainObject);
        }

        allTotalPopulation = maleTotalPopulation + femaleTotalPopulation;
        allMigrantPopulation = maleMigrantPopulation + femaleMigrantPopulation;

        let totalObj = new Object();
        totalObj.District = unqDistricts[j];
        totalObj.AgeGroup = "All Ages";
        totalObj.MaleValue = maleTotalPopulation;
        totalObj.FemaleValue = femaleTotalPopulation;
        totalObj.TotalValue = allTotalPopulation;

        let migrationObject = new Object();
        migrationObject.District = unqDistricts[j];
        migrationObject.AgeGroup = "All Ages";
        migrationObject.MaleValue = maleMigrantPopulation;
        migrationObject.FemaleValue = femaleMigrantPopulation;
        migrationObject.TotalValue = allMigrantPopulation;

        let mainObject = new Object();
        mainObject.District = unqDistricts[j];
        mainObject.AgeGroup = "All Ages";
        mainObject.PopTotal = totalObj;
        mainObject.MigrationTotal = migrationObject;
        mainObject.MigrationPercentage = (allMigrantPopulation / allTotalPopulation) * 100;

        if (mainObject.District == "Bhaktapur") {
            console.log(mainObject);
        }

        rectData.push(mainObject);
    }
}
