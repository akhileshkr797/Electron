const { ipcRenderer } = require('electron')

setTimeout(() => {
    ipcRenderer.send('get-mainWindow')
}, 5000)