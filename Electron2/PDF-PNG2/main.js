const electron = require('electron')
const { app, BrowserWindow, shell, ipcMain, webContents } = electron
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
        title: 'main'

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

app.on('ready', () => {
    createWindow()
    getScreenInfo()
})

//save png
let pngCapture

ipcMain.on('save-png', event => {
    pngCapture = BrowserWindow.fromId(event.sender.webContents.id)
    let bounds = pngCapture.getBounds()
    pngCapture.webContents.capturePage({
        x: 0,
        y: 0,
        width: bounds.width,
        height: bounds.height
    }, captureImage)

    function captureImage(image) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + pngCapture.getTitle() + 'capture.png'
        console.log(filePath)
        let png = image.toPNG()
        fs.writeFileSync(filePath, png)

        event.sender.send('wrote-png', filePath)
    }
})


//save pdf
let pdfCapture

ipcMain.on('save-pdf', event => {
    pdfCapture = BrowserWindow.fromId(event.sender.webContents.id)
    pdfCapture.webContents.printToPDF({}, capturePdf)

    function capturePdf(error, data) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + pdfCapture.getTitle() + 'Capture.pdf'

        if (error) {
            console.error(error.message)
        }

        if (data) {
            fs.writeFile(filePath, data, err => {
                if (err) return console.error(error.message)
            })

            event.sender.send('wrote-pdf', filePath)
        }
    }
})



//open pdf
let win
ipcMain.on('open-pdf2', event => {
    const pdfPath = path.join(os.tmpdir(), 'default.pdf')
    console.log(pdfPath)
    win = BrowserWindow.fromWebContents(event.sender)

    win.webContents.printToPDF({}, (error, data) => {
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



//window Information

function getScreenInfo() {
    let screen = electron.screen
    let currentScreens = screen.getAllDisplays()
    console.log(currentScreens)
}