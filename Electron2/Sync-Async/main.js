const electron = require('electron')
const { app, BrowserWindow, ipcMain, shell, webContents } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow, windowToCapture, windowToPrint

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 800
    })

    mainWindow.webContents.openDevTools()

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

//sync-msg
ipcMain.on('sync', function(event, arg) {
    console.log(arg)
    event.returnValue = 'Hi Sync, I heard you.!'
})

//async-msg
ipcMain.on('async', function(event, arg) {
    if (arg === 'hello') {
        const asyncMssg = event.sender.send('asyncMsg', 'Hi Async, I heard you too')
        console.log(asyncMssg)
    }
})