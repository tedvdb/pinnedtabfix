/****************************************
 * Saving the tabs to the local storage *
 ***************************************/

// save the tabs to local storage
function saveTabs(tabs) {
  // get required info
  tabstore = getRequiredTabInfo(tabs)
  // The actual save action
  browser.storage.local.set({ tabs: tabstore })
}

// Only use the info about the tab we really need
function getRequiredTabInfo(tabs) {
  windowmapping = {}
  windowcounter = 0
  returnTabs = []

  for (let tab of tabs) {
    // Skip privileged urls, exept the allowed ones
    // We can't restore them anyway 
    if (tab.url.startsWith("about:")) {
      allowed = ["about:home", "about:blank"]
      if (!allowed.includes(tab.url)) {
        continue
      }
    }

    returnTab = {}

    if (windowmapping[tab.windowId] === undefined) {
      windowmapping[tab.windowId] = windowcounter++
    }

    returnTab['index'] = tab.index
    returnTab['window'] = windowmapping[tab.windowId]
    returnTab['url'] = tab.url

    returnTabs.push(returnTab)
  }

  return returnTabs
}

// If something went wron fetching pinned tabs
function onError(error) {
  console.log(`Pinned Tab Fix - error while fetching tabs: ${error}`)
}

// Handle changes on pinned status of the tabs
function handlePinnedTabUpdated(tabId, changeInfo, tabInfo) {
  // fetch all tabs
  let querying = browser.tabs.query({ pinned: true });
  // on success, save them
  querying.then(saveTabs, onError)
}

// Listen for changes in pinned status of the tabs
browser.tabs.onUpdated.addListener(handlePinnedTabUpdated, { properties: ["pinned"] })

/*********************************************
 * Restoring the tabs from the local storage *
 ********************************************/

async function restorePinnedTabs(tabs) {
  if (tabs === undefined || tabs.tabs === undefined) return
  currentPinnedTabs = await browser.tabs.query({ pinned: true });
  tabs = tabs.tabs
  tabsToRestore = []
  for (let tab of tabs) {
    let found = false
    for (let currentPinnedTab of currentPinnedTabs) {
      if (currentPinnedTab.url == tab.url) {
        found = true
      }
    }
    if (!found) {
      tabsToRestore.push(tab)
    }
  }

  if (tabsToRestore.length == 0) return

  let windows = await browser.windows.getAll({
    windowTypes: ["normal"]
  })
  console.log(windows)
  for (let tab of tabsToRestore) {
    if (windows[tab.window] == undefined) {
      await browser.windows.create()
      windows = await browser.windows.getAll({
        windowTypes: ["normal"]
      })
      console.log(windows)
    }
    window = windows[tab.window]
    browser.tabs.create({
      url: tab.url,
      pinned: true,
      windowId: window.id
    })
  }
}

function errorRestore(error) {
  console.log(`Pinned Tab Fix - error while restoring tabs: ${error}`)
}

let loadingTabs = browser.storage.local.get("tabs");
loadingTabs.then(restorePinnedTabs, errorRestore);

