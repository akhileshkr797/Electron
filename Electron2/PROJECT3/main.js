const electron = require('electron')
const { app, BrowserWindow, ipcMain, shell, webcontents } = electron

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
        title: 'MAIN'
    })

    //mainWindow.webContents.openDevTools()

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

//ipc msg
ipcMain.on('sync-msg', function(event, arg) {
    event.returnValue = 'Sync, I heard you.!'
})

ipcMain.on('async-msg', function(event, arg) {
    if (arg === 'Hello') {
        event.sender.send('async-msg-reply', 'I heard you Async.!')
        console.log(arg)
    }
})

//save pdf

let openPDF
ipcMain.on('save-pdf', event => {
    openPDF = BrowserWindow.fromId(event.sender.webContents.id)
    openPDF.webContents.printToPDF({}, pdfCreated)
})

function pdfCreated(error, data) {
    let desktop = app.getPath('desktop')
    let filePath = desktop + '/' + openPDF.getTitle() + '-printed.pdf'
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


//open PDF
let windowToPrint
ipcMain.on('print-to-pdf', event => {
    const pdfPath = path.join(os.tmpdir(), 'default-Open.pdf')
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