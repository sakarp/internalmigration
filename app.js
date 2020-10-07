window.addEventListener('load', function () {
    console.log("page is loaded");

    fetch('http://127.0.0.1:5500/nepalmigration.json')
        //fetch('http://api.open-notify.org/astros.json')
        .then(response => response.json())
        .then(data => {
            let dataset = data.internalmigration;
            let uniqueDistricts = [...new Set(dataset.map(x => x.District))];
            let datadiv = document.getElementById("showdatadiv");
            let dropMenu = document.getElementById("cDist");
            let maleTotalPopulation, femaleTotalPopulation, allTotalPopulation;
            let maleMigrantPopulation, femaleMigrantPopulation, allMigrantPopulation;

            //set up a dynamic menu
            /*for (i = 0; i < uniqueDistricts.length; i++) {
                let dropValue = document.createElement('option');
                dropValue.value = uniqueDistricts[i];
                dropValue.innerHTML = uniqueDistricts[i];
                dropMenu.appendChild(dropValue);
            }*/

            const urlString = window.location.search;
            const urlParam = new URLSearchParams(urlString);
            console.log(urlParam);
            let passVariable = urlParam.get('district');
            console.log(passVariable);

            let districtNameDisplay = document.getElementById("districtNameDisplay");
            districtNameDisplay.innerHTML = passVariable;

            //dropMenu.addEventListener('change', function () {
            let limitedDataset = dataset.filter(dataset => dataset.District === passVariable);
            let rowData = [... new Set(limitedDataset.map(x => x.Age_Group))];
            let rowHeader = document.getElementById("rHead");
            maleTotalPopulation = 0;
            femaleTotalPopulation = 0;
            allTotalPopulation = 0;
            maleMigrantPopulation = 0;
            femaleMigrantPopulation = 0;
            allMigrantPopulation = 0;

            //remove old stuff from row header
            while (rowHeader.firstChild) {
                rowHeader.removeChild(rowHeader.firstChild);
            }

            //set dynamic row elements
            for (i = 0; i < rowData.length; i++) {
                let rowTR = document.createElement('tr');
                let rowHeadElement = document.createElement('th');
                let rdMaleTotal = document.createElement('td');
                let rdFemaleTotal = document.createElement('td');
                let rowTotal = document.createElement('td');
                let rowMaleMigrant = document.createElement('td');
                let rowFemaleMigrant = document.createElement('td');
                let rowTotalMigrant = document.createElement('td');

                rowHeadElement.scope = "row";
                rowHeadElement.className = "rowHeadElement";
                rowHeadElement.innerHTML = rowData[i];
                rowTR.appendChild(rowHeadElement);

                let maleTot = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Male" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Total Population");
                let femaleTot = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Female" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Total Population");
                let maleRN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Male" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Rural");
                let maleUN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Male" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Urban");
                let maleSN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Male" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Not stated");
                let allMale = maleRN[0].Value + maleUN[0].Value + maleSN[0].Value;

                let femaleRN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Female" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Rural");
                let femaleUN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Female" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Urban");
                let femaleSN = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Female" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Native born" && limitedDataset.Sub_Indicator === "Born in other district" && limitedDataset.Sub_Indicator_1 === "Not stated");
                let allFemale = femaleRN[0].Value + femaleUN[0].Value + femaleSN[0].Value;

                maleTotalPopulation += maleTot[0].Value;
                rdMaleTotal.innerHTML = maleTot[0].Value;

                maleMigrantPopulation += allMale;
                rowMaleMigrant.innerHTML = allMale;

                femaleTotalPopulation += femaleTot[0].Value;
                rdFemaleTotal.innerHTML = femaleTot[0].Value;

                femaleMigrantPopulation += allFemale;
                rowFemaleMigrant.innerHTML = allFemale;

                let rowTot = femaleTot[0].Value + maleTot[0].Value;
                rowTotal.innerHTML = rowTot;

                rowTotalMigrant.innerHTML = (allMale + allFemale);


                rowTR.appendChild(rdMaleTotal);
                rowTR.appendChild(rdFemaleTotal);
                rowTR.appendChild(rowTotal);
                rowTR.appendChild(rowMaleMigrant);
                rowTR.appendChild(rowFemaleMigrant);
                rowTR.appendChild(rowTotalMigrant);
                rowHeader.appendChild(rowTR);
            }

            //add in the row header elements
            //first add in the all total
            let rowTR = document.createElement('tr');
            let rowHeadElement = document.createElement('th');
            let rdMaleTotal = document.createElement('td');
            let rdFemaleTotal = document.createElement('td');
            let rowTotal = document.createElement('td');
            let rowMaleMigrant = document.createElement('td');
            let rowFemaleMigrant = document.createElement('td');
            let rowTotalMigrant = document.createElement('td');

            rowHeadElement.scope = "row";
            rowHeadElement.className = "rowHeadElement";
            rowHeadElement.innerHTML = "All Ages";
            rowTR.appendChild(rowHeadElement);


            rdMaleTotal.innerHTML = maleTotalPopulation;
            rdFemaleTotal.innerHTML = femaleTotalPopulation;
            rowTotal.innerHTML = maleTotalPopulation + femaleTotalPopulation;

            rowMaleMigrant.innerHTML = maleMigrantPopulation;
            rowFemaleMigrant.innerHTML = femaleMigrantPopulation;
            rowTotalMigrant.innerHTML = maleMigrantPopulation + femaleMigrantPopulation;

            rowTR.appendChild(rdMaleTotal);
            rowTR.appendChild(rdFemaleTotal);
            rowTR.appendChild(rowTotal);
            rowTR.appendChild(rowMaleMigrant);
            rowTR.appendChild(rowFemaleMigrant);
            rowTR.appendChild(rowTotalMigrant);
            rowHeader.appendChild(rowTR);


            /* //clear the datadiv section
             while(datadiv.firstChild){
                 datadiv.removeChild(datadiv.firstChild);
             }
 
             //showing data dynamically 
             for (i = 0; i < limitedDataset.length; i++) {
                 let elt = document.createElement('p');
                 elt.innerHTML = limitedDataset[i].District + " " + limitedDataset[i].Gender + " " + limitedDataset[i].Value;
                 datadiv.appendChild(elt);
             }*/
            //})
        })
        .catch(error => {
            console.log("Error!!! : " + error);
        })
});

function setup() {
    background("black");
    createCanvas(600, 600);
    console.log("in setup");
}

function draw() {
    fill("white");
    circle(0, 5);
}

