const electron = require('electron')
const { app, BrowserWindow, ipcMain, Shell } = electron

const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow, secondWindow

function createWondow(fileStr, options) {
    let win = new BrowserWindow(options)

    win.loadURL(url.format({
        pathname: path.join(__dirname, fileStr),
        protocol: 'file:',
        slashes: true
    }))

    win.on('close', function() {
        win = null
    })
    return win
}

app.on('ready', () => {
    mainWindow = createWondow('index.html', {
        width: 1300,
        height: 800,
        title: 'MAIN'

    })

    secondWindow = createWondow('index.html', {
        width: 800,
        height: 500,
        title: 'SECOND'
    })
})