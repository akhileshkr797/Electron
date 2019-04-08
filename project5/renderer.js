const { remote, ipcRenderer } = require('electron')
const FindInPage = require('electron-find').FindInPage

let findInPage = new FindInPage(remote.getCurrentWebContents())

ipcRenderer.on('on-find', (e, args) => {
    findInPage.openFindWindow()
})