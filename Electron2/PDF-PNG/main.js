const electron = require('electron')
const { app, BrowserWindow, ipcMain, shell, webContents } = electron

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

app.on('ready', createWindow)

//save png
let capturePNG
ipcMain.on('save-png', event => {
    capturePNG = BrowserWindow.fromId(event.sender.webContents.id)
    let bounds = capturePNG.getBounds()
    capturePNG.webContents.capturePage({
        x: 0,
        y: 0,
        width: bounds.width,
        height: bounds.height
    }, imageCapture)

    function imageCapture(image) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + capturePNG.getTitle() + 'Capture.png'
        console.log(filePath)
        let png = image.toPNG()
        fs.writeFileSync(filePath, png)
    }
})

//save pdf
let capturePDF
ipcMain.on('save-pdf', event => {
    capturePDF = BrowserWindow.fromId(event.sender.webContents.id)
    capturePDF.webContents.printToPDF({}, pdfCreated)

    function pdfCreated(error, data) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + capturePDF.getTitle() + 'Capture.pdf'
        console.log(filePath)

        if (error) {
            console.error(error.message)
        }
        if (data) {
            fs.writeFile(filePath, data, err => {
                if (err) {
                    console.error(error.message)
                }
            })
        }
    }
})

//open PDF
let openWinPDF
ipcMain.on('open-pdf', event => {
    const pdfPath = path.join(os.tmpdir(), 'default.pdf')
    openWinPDF = BrowserWindow.fromWebContents(event.sender)

    openWinPDF.webContents.printToPDF({}, (error, data) => {
        if (error) {
            console.error(error.message)
        }

        if (data) {
            fs.writeFile(pdfPath, data, err => {
                if (err) return console.error(error.message)

                shell.openExternal('file://' + pdfPath)
                event.sender.send('wrote-pdf', pdfPath)
            })
        }
    })
})