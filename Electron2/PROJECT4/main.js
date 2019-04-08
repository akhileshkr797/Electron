const electron = require('electron')
const { app, BrowserWindow, ipcMain, webContents, shell } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')
const os = require('os')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1300,
        height: 800,
        show: false,
        title: 'MAIN'
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

//open pdf
let win
ipcMain.on('open-pdf', event => {
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

//save PNG
let capturePNG
ipcMain.on('save-png', event => {
    capturePNG = BrowserWindow.fromId(event.sender.webContents.id)
    let bounds = capturePNG.getBounds()
    capturePNG.webContents.capturePage({
        x: 0,
        y: 0,
        width: bounds.width,
        height: bounds.height
    }, captureImage)

    function captureImage(image) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + capturePNG.getTitle() + 'capture.png'
        console.log(filePath)
        let png = image.toPNG()
        fs.writeFileSync(filePath, png)

        event.sender.send('save-png2', filePath)
    }
})

//save pdf
let capturePDF
ipcMain.on('save-pdf', event => {
    capturePDF = BrowserWindow.fromId(event.sender.webContents.id)
    capturePDF.webContents.printToPDF({}, pdfCreated)

    function pdfCreated(error, data) {
        let desktop = app.getPath('desktop')
        let filePath = desktop + '/' + capturePDF.getTitle() + 'capture.pdf'

        if (error) {
            console.log(error.message)
        }

        if (data) {
            fs.writeFile(filePath, data, error => {
                if (error) {
                    console.log(error.message)
                }
                event.sender.send('save-pdf2', filePath)
            })
        }

    }
})