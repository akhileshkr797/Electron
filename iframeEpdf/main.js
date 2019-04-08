const electron = require('electron')
const { app, BrowserWindow, webContents, ipcMain } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow, windowToPrint

function createWindow() {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1200,
        height: 700,
        backgroundColor: '#cec',
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
}

app.on('ready', createWindow)

//print-to-pdf
ipcMain.on('pdf', function(event) {
    windowToPrint = BrowserWindow.fromId(event.sender.webContents.id)
    windowToPrint.webContents.printToPDF({}, pdfCreated)
})

function pdfCreated() {
    let desktop = app.getPath('desktop')
    let filePath = desktop + '/' + windowToPrint.getTitle() + '-printed.pdf'
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