let userKey = {
    "status_normal_10000": "",
}


function getUserKey(key) {
    return cc.sys.localStorage.getItem(key)
}

function setUserKey(key, value) {
    cc.sys.localStorage.setItem(key, value)
}

module.exports = {
    userKey,
    getUserKey, 
    setUserKey,
}
