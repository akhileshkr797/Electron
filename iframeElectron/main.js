const electron = require('electron')
const { app, BrowserWindow, ipcMain, shell, webContents } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

let mainWindow
let splashWindow


//main Window
function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 800,
        backgroundColor: '#cfce',
        title: 'MAIN-Window'
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

app.on('ready', function() {
    createSplashWindow()
})

//splash Window

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        show: false,
        width: 300,
        height: 250,
        //backgroundColor: '#dcdfe',
        frame: false,
        transparent: true,
        alwaysOnTop: true
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

ipcMain.on('mainWindow-init', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 1000)
    }
    mainWindow.show()
})

//open pdf
ipcMain.on('print-to-pdf', event => {
    const pdfPath = path.join(os.tmpdir(), 'default-Open-Pdf.pdf')
    windowToPrint = BrowserWindow.fromWebContents(event.sender)

    windowToPrint.webContents.printToPDF({}, (error, data) => {
        if (error) {
            console.error(error.message)
        }

        fs.writeFile(pdfPath, data, err => {
            if (err) return console.error(error.message)
            shell.openExternal('file://' + pdfPath)
            event.sender.send('wrote-pdf', pdfPath)
        })
    })
})