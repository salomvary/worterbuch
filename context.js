chrome.contextMenus.create({
  title:    'Wörterbuch',
  contexts: ['selection'],
  onclick:  lookup
});

chrome.omnibox.onInputEntered.addListener(lookup);

function lookup(data) {
  data = typeof data == 'string' ? data : data.selectionText;
  var url = 'http://de.thefreedictionary.com/'
      + encodeURIComponent(data);
	// would be great to simply do window.open(url, 'worterbuch')
	// here but it doesn't update the window with the url when reusing
	openUrl(url);
}

var tabId;

function openUrl(url) {
	if(tabId) {
		chrome.tabs.get(tabId, function(tab) {
			if(tab) {
				updateTab(tab.id, url);
			} else {
				createTab(url);
			}
		});
	} else {
		createTab(url);
	}
}

function createTab(url) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		chrome.tabs.create({
			index: tabs[0].index + 1,
			openerTabId: tabs[0].id,
			url: url
		}, function(tab) {
			tabId = tab.id;
		});
	});
}

function updateTab(tabId, url) {
	chrome.tabs.update(tabId, {
		active: true,
		url: url
	});
}
