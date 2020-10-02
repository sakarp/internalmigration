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

            //set up a dynamic menu
            for (i = 0; i < uniqueDistricts.length; i++) {
                let dropValue = document.createElement('option');
                dropValue.value = uniqueDistricts[i];
                dropValue.innerHTML = uniqueDistricts[i];
                dropMenu.appendChild(dropValue);
            }

            dropMenu.addEventListener('change', function () {
                let limitedDataset = dataset.filter(dataset => dataset.District === dropMenu.value);
                let rowData = [... new Set(limitedDataset.map(x => x.Age_Group))];
                let rowHeader = document.getElementById("rHead");
                maleTotalPopulation = 0;
                femaleTotalPopulation = 0;
                allTotalPopulation = 0;

                //remove old stuff from row header
                while(rowHeader.firstChild){
                    rowHeader.removeChild(rowHeader.firstChild);
                }

                //set dynamic row elements
                for (i=0; i < rowData.length; i++){
                    let rowTR = document.createElement('tr');
                    let rowHeadElement = document.createElement('th');
                    let rdMaleTotal = document.createElement('td');
                    let rdFemaleTotal = document.createElement('td');

                    rowHeadElement.scope = "row";
                    rowHeadElement.className = "rowHeadElement";
                    rowHeadElement.innerHTML = rowData[i];
                    rowTR.appendChild(rowHeadElement);
                    //rowHeader.appendChild(rowTR);

                    
                    let maleTot = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Male" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Total Population");
                    let femaleTot = limitedDataset.filter(limitedDataset => limitedDataset.Gender === "Female" && limitedDataset.Age_Group === rowData[i] && limitedDataset.Indicator === "Total Population");
                    
                    maleTotalPopulation += maleTot[0].Value;
                    rdMaleTotal.innerHTML = maleTot[0].Value;

                    femaleTotalPopulation += femaleTot[0].Value;
                    rdFemaleTotal.innerHTML = femaleTot[0].Value;
                    rowTR.appendChild(rdMaleTotal);
                    rowTR.appendChild(rdFemaleTotal);
                    rowHeader.appendChild(rowTR);
                }

                //add in the row header elements
                //first add in the all total
                let rowTR = document.createElement('tr');
                let rowHeadElement = document.createElement('th');
                let rdMaleTotal = document.createElement('td');
                let rdFemaleTotal = document.createElement('td');
                    rowHeadElement.scope = "row";
                    rowHeadElement.className = "rowHeadElement";
                    rowHeadElement.innerHTML = "All Ages";
                    rowTR.appendChild(rowHeadElement);
                    

                    rdMaleTotal.innerHTML = maleTotalPopulation;
                    rdFemaleTotal.innerHTML = femaleTotalPopulation;
                    rowTR.appendChild(rdMaleTotal);
                    rowTR.appendChild(rdFemaleTotal);
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
            })
        })
        .catch(error => {
            console.log("Error!!! : " + error);
        })
});

