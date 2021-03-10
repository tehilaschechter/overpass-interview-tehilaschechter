function ParkingEntry(license, timeIn, timeOut) {
    this.license = license;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
    this.duration = calculateDurationInHours(timeIn, timeOut);
    this.price = calculatePrice(this.duration);
}

function calculateDurationInHours(timeIn, timeOut) {
    var durationInHours = Math.abs(timeOut - timeIn) / 36e5;
    return Math.round(durationInHours * 100) / 100;;
}

function calculatePrice(durationInHours) {
    const ratePerHour = 2.99;
    const chargeableTime = durationInHours - 1;

    let price = chargeableTime * ratePerHour;
    if (price < 0) return 0;

    // round to nearest cent, always returning two decimal places for cents
    return (Math.round(price * 100) / 100).toFixed(2);
}

function initializeParkingEntries(parkingEntryData) {
    var parkingEntries = [];
    var parkingData = JSON.parse(parkingEntryData);

    // sort in descending order of the time the car exited the garage
    parkingData.sort(function (a, b) { return b.timeOut - a.timeOut })
    for (let entry of parkingData) {
        parkingEntries.push(new ParkingEntry(entry.license, entry.in, entry.out))
    }
    return parkingEntries;
}

// Set up array to access fields in order
// Can't use Object.entries() because will be in wrong order. Need to maintain order so calcuations can be made
function getParkingEntryFields(parkingEntryObject) { // TODO 
    return [Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('license')],
    Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('price')],
    Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('duration')],
    Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('timeIn')],
    Object.values(parkingEntryObject)[Object.values(parkingEntryObject).indexOf('timeOut')]];
}

function getParkingEntryValueForFieldIndex(parkingEntryObject, fieldIndex) {
    switch (fieldIndex) {
        case 0:
            return parkingEntryObject.license;
            break;
        case 1:
            return parkingEntryObject.price;
            break;
        case 2:
            return parkingEntryObject.duration;
            break;
        case 3:
            return formatDate(parkingEntryObject.timeIn);
            break;
        case 4:
            return formatDate(parkingEntryObject.timeOut);
            break;
    }
}

function formatDate(date) {
    date = new Date();

    // date
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    // time
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // change the hour '0' to '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + " " + ampm;

    return month + '/' + day + '/' + year + " " + strTime;
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    let keys = getParkingEntryFields(data);
    for (let key of keys) {
        let th = document.createElement("th");
        let text = document.createTextNode(key.toUpperCase());
        th.appendChild(text);
        row.appendChild(th);
    }
}

function handleNotCharged(price, row) {
    if (price == 0) row.style.backgroundColor = '#4682B4';
}

function handleOvertime(durationInHours, row) {
    if (durationInHours >= 24) row.style.color = 'ff0000';
}

function generateTableBody(table, data) {
    const fields = getParkingEntryFields(Object.keys(data[0]));

    for (let entry of data) {
        let row = table.insertRow();

        handleNotCharged(entry.price, row);
        handleOvertime(entry.duration, row);

        for (let i = 0; i < fields.length; i++) {
            let cell = row.insertCell();
            cell.style.border = '1px solid black';
            let text = document.createTextNode(getParkingEntryValueForFieldIndex(entry, i));
            cell.appendChild(text);
        }

    }
}

function createTable(data) {
    let table = document.querySelector("table");
    let headers = Object.keys(data[0]);

    table.style.width = '100px';
    table.style.border = '1px solid black';

    generateTableBody(table, data);
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
