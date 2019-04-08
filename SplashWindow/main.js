const electron = require('electron')
const { app, BrowserWindow, webContents } = electron
const ipcMain = electron.ipcMain
const path = require('path')
const url = require('url')
const fs = require('fs')


let mainWindow
let splashWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        title: 'mainWindow'
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', function() {
        mainWindow = null
    })
}

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 320,
        height: 240,
        frame: false,
        resizable: false,
        show: false,
        title: 'splashWindow'
    })



    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file:',
        slashes: true
    }))

    splashWindow.once('ready-to-show', () => {
        splashWindow.show()
        createWindow()

    })

    splashWindow.on('close', function() {
        splashWindow = null
    })
}

app.on('ready', createSplashWindow)

//ipc communication

ipcMain.on('get-version', event => {
    console.log('App version', app.getVersion())
    event.sender.send('set-version')
})

ipcMain.on('app-init', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 2000)
    }
    mainWindow.show()
})