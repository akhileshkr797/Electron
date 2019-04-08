const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')
const isOnline = require('is-online')


let mainWindow, checkIsOnlineInterval, currentOnlineStatus

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 700
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
    startCheckingOnlineStatus()
}

app.on('ready', createWindow)

//checking Online

function checkIsOnline() {
    isOnline().then(online => {
        console.log("Online? " + online)
        mainWindow.webContents.send('update-online-status', { online: online })
        if (currentOnlineStatus !== online) {
            if (process.platform === 'darwin') {
                app.dock.bounce('informational')
            }
        }
        currentOnlineStatus = online
    })
}

function startCheckingOnlineStatus() {
    checkIsOnlineInterval = setInterval(checkIsOnline, 10000)
}