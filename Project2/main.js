const electron = require('electron')
const { app, BrowserWindow, ipcMain } = electron
const path = require('path')
const url = require('url')

let mainWindow
let splashWindow

function createWindow() {
    mainWindow = new BrowserWindow({
            show: false,
            width: 1250,
            height: 750,
            backgroundColor: '#ccb'

        })
        /*
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            }))
        */
}


function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        //resizable: false,
        backgroundColor: '#cce',
        alwaysOnTop: true,
        show: false
    })
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash.html'),
        protocol: 'file',
        slashes: true
    }))
    splashWindow.on('closed', () => {
        splashWindow = null
    })
    splashWindow.once('ready-to-show', () => {
        splashWindow.show()
        createWindow()
    })
}

app.on('ready', createSplashWindow)

//IPC Msg
ipcMain.on('get-mainWindow', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 3000)
    }
    mainWindow.show()
})