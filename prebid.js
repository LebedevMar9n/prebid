let btn = document.createElement("button");
btn.innerHTML = "Show table";
btn.type = "submit";
btn.name = "formBtn";
document.body.appendChild(btn);

let myTable = document.createElement('table');
document.body.appendChild(myTable);

let headers = ['Ad unit code', 'Sizes', 'Bidders', 'Ad unit path'];

let myTable1 = document.createElement("table");
document.body.appendChild(myTable1);

let headers1 = ["Bidder name", "CPM", "Currency", "Size"];


btn.addEventListener("click", function () {


    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    headers.forEach((headerText) => {
        let header = document.createElement("th");
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
    pbjs.adUnits.forEach((unit) => {
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = unit.code;
        cell2.innerHTML = unit.mediaTypes.banner.sizes;
        let arr = [];
        unit.bids.forEach((bid) => {
            arr.push(bid.bidder);
        });
        cell3.innerHTML = arr.join("\r\n");
        var adslots = googletag.pubads().getSlots();
        //loop through the GPT adslots
        for (i = 0; i < adslots.length; i++) {
            //get slot defined div ID
            let slodId = adslots[i].getSlotId().getDomId();
            let slotPath = adslots[i].getAdUnitPath();
            if (unit.code === slodId) {
                cell4.innerHTML = slotPath;
            }
            console.group('slodId : ', slodId);
            //get slot defined path
            console.log('slotPath : ', slotPath);
            console.groupEnd();
        }

        table.appendChild(row);
    });

    myTable.appendChild(table);


    let table1 = document.createElement("table");
    let headerRow1 = document.createElement("tr");
    headers1.forEach((headerText) => {
        let header = document.createElement("th");
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow1.appendChild(header);
    });
    table1.appendChild(headerRow1);
    Object.values(pbjs.getBidResponses()).forEach((res) => {
        res.bids.forEach((el) => {
            var row = table1.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            cell1.innerHTML = el.bidder;
            cell2.innerHTML = el.cpm;
            cell3.innerHTML = el.currency;
            cell4.innerHTML = `Width:${el.width} Height:${el.height}`;
            console.log(el);
        });
    });

    myTable1.appendChild(table1);

}, false);

var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
    pbjs.requestBids({
        bidsBackHandler: initAdserver,
        timeout: PREBID_TIMEOUT
    });
});

function initAdserver() {
    if (pbjs.initAdserverSet) return;
    pbjs.initAdserverSet = true;
    googletag.cmd.push(function () {
        pbjs.que.push(function () {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
        });
    });
}

// =====monkey patching======

// const { fetch: originalFetch } = window;
// window.fetch = async (...args) => {
//     let [resource, config] = args;

//     // request interceptor starts
//     console.log("resource", resource);
//     // request interceptor ends
//     await originalFetch(resource, config);
//     const response = await originalFetch(resource, config);

//     // response interceptor here
//     return response;
// };
