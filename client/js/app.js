function ParkingEntry(license, timeIn, timeOut) {
    this.license = license;
    this.price = calculatePrice(this.duration);
    this.duration = calculateDuration(timeIn, timeOut);
    this.timeIn = timeIn;
    this.timeOut = timeOut;
}

function calculateDuration(timeIn, timeOut) {
    return timeOut - timeIn;
    // TODO change to hours
}

function calculatePrice(duration) {
    const ratePerHour = 2.99;
    const chargeableTime = duration - 1;

    return chargeableTime * ratePerHour;
}

function initializeParkingEntries(parkingEntryData) {
    var parkingEntries = [];
    var parkingData = JSON.parse(parkingEntryData);

    for (let entry of parkingData) {
        parkingEntries.push(new ParkingEntry(entry.license, entry.in, entry.out))
    }
    return parkingEntries;
}

// Set up array to access fields in order
// Can't use Object.entries() because will be in wrong order. Need to maintain order so calcuations can be made
function getParkingEntryFields(parkingEntryObject) {
    return [Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('license')],
            Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('price')],
            Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('duration')],
            Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('timeIn')],
            Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('timeOut')]];
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of getParkingEntryFields(data)) {
        let th = document.createElement("th");
        th.style.border = '1px solid black';
        let text = document.createTextNode(key.toUpperCase());
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

function createTable(data) {
    let table = document.querySelector("table");
    let headers = Object.keys(data[0]);

    table.style.width = '100px';
    table.style.border = '1px solid black';

    generateTable(table, data);
    generateTableHead(table, headers);
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(initializeParkingEntries(xmlHttp.responseText));
        }
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

httpGetAsync("http://localhost:4200/api/event", createTable)
