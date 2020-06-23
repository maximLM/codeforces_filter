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
    });
}

function addToList(listName, handle) {
    chrome.storage.sync.get([listName], function(result) {
        let list = String(Object.values(result)[0]).split(",")
        list.push(handle)
        chrome.storage.sync.set({listName: list}, function () {
            displayBlackList()
            console.log("added " + handle + " to " + listName)
        })
    })
}


function eraseFromList(listName, handle) {
    console.log("erasing " + handle + " from " + listName)
    chrome.storage.sync.get([listName], function(result) {
        let list = String(Object.values(result)[0]).split(",")
        list = list.filter(function (s) {
            return !(s === handle);
        })
        chrome.storage.sync.set({listName: list}, function () {
            displayBlackList()
            console.log("erased " + handle + " from " + listName)
        })
    })
}


function displayBlackList() {
    chrome.storage.sync.get(['blacklist'], function (result) {
        let blacklist = String(result.blacklist).split(",")
        blacklist = blacklist.filter(function (s) {
            return !(s === "");
        })
        let container = document.getElementById("blacklist_container")
        let newInnerHTML = "<table>"
        for (let i = 0; i < blacklist.length; ++i) {
            newInnerHTML += "<tr><td>" + blacklist[i] + "</td><td><button class='erase-button' id=" + blacklist[i] + ">X</button></td></tr>"
        }
        newInnerHTML += "</table>";
        container.innerHTML = newInnerHTML
        let buttons = container.getElementsByClassName('erase-button')
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].onclick = function () {
                eraseFromList('blacklist', buttons[i].id)
            }
        }
    })

}


drawLevel()
displayBlackList()

chrome.storage.onChanged.addListener(function(changes, namespace) {
    drawLevel()
});

for (let i = 0; i < buttons.length; ++i) {
    buttons[i].onclick = function () {
        let id = Number(buttons[i].getAttribute('id'))
        chrome.storage.sync.set({'level': id}, function() {
            reloadCurrentTab()
            setTimeout(() => {  window.close(); }, 250);
        });
    }
}


node = document.getElementById("blacklist_input")
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addToList('blacklist', node.value)
        node.value = ""
        reloadCurrentTab()
    }
});


