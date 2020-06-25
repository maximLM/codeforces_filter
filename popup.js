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
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}

function addToBlackList(handle) {
    if (handle.includes(' '))
        return
    chrome.storage.sync.get(['blacklist'], function (result) {
        if (String(result.blacklist).split(',').includes(handle))
            return
        let list = String(result.blacklist) + "," + handle
        chrome.storage.sync.set({'blacklist': list}, function () {
        })
    })
}

function eraseFromBlackList(handle) {
    chrome.storage.sync.get(['blacklist'], function (result) {
        let list = String(result.blacklist).split(",")
        list = list.filter(function (s) {
            return !(s === handle);
        })
        chrome.storage.sync.set({'blacklist': list}, function () {
        })
    })
}

function displayBlackList() {
    chrome.storage.sync.get(['blacklist'], function (result) {
        blacklist = String(result.blacklist).split(",")
        blacklist = blacklist.filter(function (s) {
            return !(s === "");
        })
        blacklist.sort()
        let container = document.getElementById("blacklist_container")
        let newInnerHTML = "<table class='table'>"
        for (let i = 0; i < blacklist.length; ++i) {
            newInnerHTML += "<tr><td>" + blacklist[i] + "</td><td><span class=\"glyphicon glyphicon-remove\" id=" + blacklist[i] + "></span></td></tr>"
        }
        newInnerHTML += "</table>";
        container.innerHTML = newInnerHTML
        let buttons = container.getElementsByClassName('glyphicon glyphicon-remove')
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].onclick = function () {
                eraseFromBlackList(buttons[i].id)
            }
        }
    })
}

function initStorage() {
    chrome.storage.sync.get(['level'], function (result) {
        if (result.level == null) {
            chrome.storage.sync.set({level: "0"}, function () {
            })
        }
    })
    chrome.storage.sync.get(['blacklist'], function (result) {
        if (result.blacklist == null) {
            chrome.storage.sync.set({blacklist: ""}, function () {
            })
        }
    })
}

function addOnClickColorButtons() {
    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].onclick = function () {
            let id = Number(buttons[i].getAttribute('id'))
            chrome.storage.sync.set({'level': id}, function () {
                setTimeout(() => {
                    window.close();
                }, 250);
            });
        }
    }
}

initStorage()
drawLevel()
displayBlackList()

chrome.storage.onChanged.addListener(function (changes, namespace) {
    drawLevel()
    reloadCurrentTab()
    displayBlackList()
});
addOnClickColorButtons()

node = document.getElementById("blacklist_input")
node.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addToBlackList(node.value)
        node.value = ""
    }
});
