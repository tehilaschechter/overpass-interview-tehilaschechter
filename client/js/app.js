function ParkingEntry(){
    this.license = license;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
    this.duration = calculateDuration(timeIn, timeOut);
    this.price = calculatePrice(this.duration);
}

function calculateDuration(timeIn, timeOut){
    return timeOut - timeIn;
}

function calculatePrice(duration){
    const ratePerHour = 2.99;
    const chargeableTime = duration - 1;

    return chargeableTime * ratePerHour;
}

function initializeParkingEntries(parkingEntryData){
    var parkingEntries = [];
    for (let entry of parkingEntryData){
        parkingEntries.push(new ParkingEntry(JSON.parse(entry)))
    }
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        th.style.border = '1px solid black';
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let entry of data) {
        let row = table.insertRow();
        /*for (key in entry) {
            let cell = row.insertCell();
            cell.style.border = '1px solid black';
            let text = document.createTextNode(entry[key]);
            cell.appendChild(text);
        }*/
        let licenseCell = row.insertCell();
        licenseCell.style.border = '1px solid black';
        let licenseText = document.createTextNode(entry.license);
        licenseCell.appendChild(licenseText);

        let priceCell = row.insertCell();
        priceCell.style.border = '1px solid black';
        let priceText = document.createTextNode(entry.price);
        priceCell.appendChild(priceText);

        let durationCell = row.insertCell();
        durationCell.style.border = '1px solid black';
        let durationText = document.createTextNode(entry.duration);
        durationCell.appendChild(durationText);

        let timeInCell = row.insertCell();
        timeInCell.style.border = '1px solid black';
        let timeInText = document.createTextNode(entry.timeIn);
        timeInCell.appendChild(timeInText);

        let timeOutCell = row.insertCell();
        timeOutCell.style.border = '1px solid black';
        let timeOutText = document.createTextNode(entry.timeOut);
        timeOutCell.appendChild(timeOutText);
    }
}

function createTable(data){
    let table = document.querySelector("table");
    let headers = Object.keys(data[0]);

    table.style.width  = '100px';
    table.style.border = '1px solid black';

    generateTable(table, data);
    //generateTableHead(table, headers); 
}

function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            callback(JSON.parse(xmlHttp.responseText));
        }    
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync("http://localhost:4200/api/event", createTable)
