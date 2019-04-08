const electron = require('electron')
const { app, BrowserWindow, ipcMain, shell, webContents } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

let mainWindow, windowToPrint
let splashWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 750,
        title: 'MAIN',
        backgroundColor: '#ccd'
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

app.on('ready', createSplashWindow)

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        show: false,
        width: 350,
        height: 300,
        backgroundColor: '#000',
        frame: false,
        resizable: false,
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

    splashWindow.on('close', () => {
        splashWindow = null
    })
}



//splashWindow

ipcMain.on('get-mainWindow', event => {
    if (splashWindow) {
        setTimeout(() => {
            splashWindow.close()
        }, 1000)
    }
    mainWindow.show()
})


/*
//print-to-pdf
ipcMain.on('print-to-pdf', event => {
    windowToPrint = BrowserWindow.fromId(event.sender.webContents.id)
    windowToPrint.webContents.printToPDF({}, pdfCreated)
})

function pdfCreated(error, data) {
    let desktop = app.getPath('desktop')
    let filePath = desktop + '/' + windowToPrint.getTitle() + '-printed.pdf'
    console.log(filePath)
    if (error) {
        console.error(error.message)
    }
    if (data) {
        fs.writeFile(filePath, data, error => {
            if (error) {
                console.error(error.message)
            }
        })
    }
}

*/

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
    //PDF TO Print