
comments = document.getElementsByClassName('comment')
ranks = [
    'rated-user user-gray',     // 0
    'rated-user user-green',    // 1
    'rated-user user-cyan',     // 2
    'rated-user user-black',    // 3
    'rated-user user-blue',     // 4
    'rated-user user-violet',   // 5
    'rated-user user-orange',   // 6
    'rated-user user-red',      // 7
    'rated-user user-legendary',// 8
]
chrome.storage.sync.get(['level'], function(result) {
    BLOCK = result.level
    if (BLOCK == null)
        BLOCK = 0
    BLOCK = Number(BLOCK)

    for (let i = 0; i < comments.length; ++i) {
        let htmlElement = comments[i]
        let have = false
        for (let lev = BLOCK + 1; !have && lev < ranks.length; ++lev)
            have |= htmlElement.getElementsByClassName(ranks[lev]).length > 0
        if (!have)
            htmlElement.innerHTML = ''
    }

})
