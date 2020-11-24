
async function fillTable(tabs) {

    let table = document.getElementById("tablist");

    if (tabs === undefined || tabs.tabs === undefined) {
        let row = table.insertRow();
        let cell = row.insertCell()
        cell.appendChild(document.createTextNode("No tabs stored."));
        return
    }
    tabs = tabs.tabs
    for (let tab of tabs) {
        let row = table.insertRow();
        let windowcell = row.insertCell()
        windowcell.appendChild(document.createTextNode(tab.window));

        let urlcell = row.insertCell()
        urlcell.appendChild(document.createTextNode(tab.url));
    }
}

function errorRestore(error) {
    console.log(`Pinned Tab Fix - error while loading tabs: ${error}`)
}

let loadingTabs = browser.storage.local.get("tabs");
loadingTabs.then(fillTable, errorRestore);
