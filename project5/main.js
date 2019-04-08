const electron = require('electron')
const { app, BrowserWindow, webContents, globalShortcut } = electron

const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

let mainWindow

function createWindow() {

    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 800,
        title: 'MAIN'
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

    globalShortcut.register('CommandOrControl+F', () => {
        mainWindow.webContents.send('on-find');
    });
}


app.on('ready', () => {
    createWindow()

})

//search-in-page