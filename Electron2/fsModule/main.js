const electron = require('electron')
const { app, BrowserWindow, ipcMain, dialog } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1000,
        height: 500,
        backgroundColor: '#ccfe',
        title: 'fsModule'
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

/* openDirectory*/
ipcMain.on('fileMsg', function(event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        title: 'please select..',
        buttonLabel: 'Click..'

    }, function(files) {
        if (files)
            event.sender.send('selected', files)
    })
})

//getting information of file..