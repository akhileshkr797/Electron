const electron = require('electron')
const { app, BrowserWindow, webContents, ipcMain, shell } = electron
const path = require('path')
const url = require('url')
const os = require('os')

let mainWindow

function createWindow(fileStr, options) {
    let win = new BrowserWindow(options)

    //webcontents events

    win.webContents.on('did-start-loading', event => {
        console.log('did-start-loading', event.sender.webContents.browserWindowOptions.title)
    })

    win.webContents.on('dom-ready', event => {
        console.log('dom-ready')
    })

    win.webContents.on('did-finish-load', event => {
        console.log('did-finish-load', event.sender.webContents.getTitle())
    })

    win.webContents.on('did-stop-loading', event => {
        console.log('did-stop-loading', event.sender.webContents.id)
    })

    win.webContents.on('did-fail-load', event => {
        console.log('did-fail-load', event.sender.webContents.getTitle())
    })

    win.webContents.on('did-frame-finish-load', event => {
        console.log('did-frame-finish-load', event.sender.webContents.getTitle())
    })

    win.webContents.on('did-get-response-details', event => {
        console.log('did-get-response-details', event.sender.webContents.browserWindowOptions.id)
    })



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

app.on('ready', event => {
    mainWindow = createWindow('index.html', {
        width: 1300,
        height: 800,
        title: 'main'
    })
})

//search in page

const searchInPage = require('../..').default;
const remote = require('electron').remote;

/*
 * Create a search instance for the current page.
 * Make sure that create the search instance per one WebContents instance.
 */
const search = searchInPage(remote.getCurrentWebContents());

document.getElementById('search-page-button').addEventListener('click', () => {
    /*
     * .openSearchWindow() method opens and activates a search window.
     * User can input the query and start the word seatch in page.
     */
    search.openSearchWindow();
});