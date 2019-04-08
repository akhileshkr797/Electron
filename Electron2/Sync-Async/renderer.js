const { ipcRenderer } = require('electron')


//sync-msg
const syncMsg = document.getElementById('syncBtn')
syncMsg.addEventListener('click', function() {
    const reply = ipcRenderer.sendSync('sync', 'hello')
    console.log(reply)
    const msg = `${reply}`
    document.getElementById('syncReply').innerHTML = msg
})

//Async-msg
const asyncMSg = document.getElementById('asyncBtn')
asyncMSg.addEventListener('click', function(event, arg) {
    ipcRenderer.send('async', 'hello')
})

ipcRenderer.on('asyncMsg', function(event, arg) {
    const mssg = `${arg}`
    document.getElementById('asyncReply').innerHTML = mssg
})