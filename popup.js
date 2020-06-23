buttons = document.getElementsByClassName('button')

colors = ['#808080', '#008d00', '#03afa0', 'gray', '#5e04ff', '#b800ab', '#ff8a00', '#fd090a', '#8B0000', 'gray']

function drawLevel() {
    chrome.storage.sync.get(['level'], function (result) {
        let BLOCK = result.level
        if (BLOCK == null)
            BLOCK = 0
        BLOCK = Number(BLOCK)
        drawLevel(BLOCK)
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].style = 'background-color:default'
        }
        document.getElementById(BLOCK).style = 'background-color:' + colors[BLOCK + 1]
    })
}

function reloadCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
        setTimeout(() => {  window.close(); }, 250);
    });
}

function addToBlackList(handle) {
    chrome.storage.sync.get(['blacklist'], function(result) {
        let blacklist = Array(result.blacklist)
        blacklist.push(handle)
        chrome.storage.sync.set({'blacklist': blacklist}, function () {
            alert("added " + handle + " to blacklist")
        })
    })
}

drawLevel()

chrome.storage.onChanged.addListener(function(changes, namespace) {
    drawLevel()
});

for (let i = 0; i < buttons.length; ++i) {
    buttons[i].onclick = function () {
        let id = Number(buttons[i].getAttribute('id'))
        chrome.storage.sync.set({'level': id}, function() {
            reloadCurrentTab()
        });
    }
}


node = document.getElementById("blacklist_input")
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addToBlackList(node.value)
        node.value = ""
    }
});


