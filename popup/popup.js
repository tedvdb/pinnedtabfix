
function fillTable(tabs) {
    let table = document.getElementById("tablist")

    // Clear rows, from bottom to top (to keep indexes consistant)
    // Skip row[0], that's the header
    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i)
    }

    if (tabs === undefined || tabs.tabs === undefined) {
        let row = table.insertRow()
        let cell = row.insertCell()
        cell.appendChild(document.createTextNode("No tabs stored."))
        return
    }
    tabs = tabs.tabs
    for (let tab of tabs) {
        let row = table.insertRow();

        let faviconcell = row.insertCell()
        let favicon = document.createElement("img")
        if(tab.favicon !== undefined) {
            favicon.setAttribute('src', tab.favicon)
        }
        favicon.setAttribute('class', 'favicon')
        faviconcell.appendChild(favicon)

        let windowcell = row.insertCell()
        windowcell.appendChild(document.createTextNode(tab.window))

        let urlcell = row.insertCell()
        urlcell.appendChild(document.createTextNode(tab.url))
    }
}

document.getElementById('refreshicon').addEventListener('click', () => {
    handlePinnedTabUpdated(undefined, undefined, undefined)
    refreshList()
});

function errorRestore(error) {
    console.log(`Pinned Tab Fix - error while loading tabs: ${error}`)
}

function refreshList() {
    let loadingTabs = browser.storage.local.get("tabs");
    loadingTabs.then(fillTable, errorRestore);
}

refreshList()