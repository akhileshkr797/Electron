const electron = require('electron')
const { app, BrowserWindow, ipcMain, webContents, dialog } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 900,
        height: 600,
        backgroundColor: '#cce',
        title: 'FILE-OPEN'
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', function() {
        mainWindow = null
    })

}

app.on('ready', createWindow)

//file Open

ipcMain.on('selectFile', function(event) {
    dialog.showOpenDialog(mainWindow, {
        title: 'Select a file...',
        properties: ['openFile'],
        defaultPath: '/Users/OHM/Documents/',
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            { name: 'Text', extensions: ['txt'] }
        ]
    }, function(files) {
        if (files)
            event.sender.send('selectedItem', files)
    })
})