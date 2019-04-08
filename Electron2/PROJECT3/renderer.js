const { ipcRenderer, remote } = require('electron')

//sync ipc msg
const syncMsgBtn = document.getElementById('syncBtn')
syncMsgBtn.addEventListener('click', function() {
    const reply = ipcRenderer.sendSync('sync-msg', 'hello')
    console.log(reply)
    const msg = `Sync Response: ${reply}`
    document.getElementById('syncReply').innerHTML = msg
})

//Async ipc msg
const asyncMsgBtn = document.getElementById('asyncBtn')
asyncMsgBtn.addEventListener('click', function(event, arg) {
    ipcRenderer.send('async-msg', 'Hello')
    console.log(arg)
})

ipcRenderer.on('async-msg-reply', function(event, arg) {
    const msg = `Async Response: ${arg}`
    console.log(arg)
    document.getElementById('asyncReply').innerHTML = msg
})


//save pdf

const savePDF = document.getElementById('pdfSave')
savePDF.addEventListener('click', savePdfClickHandler)

function savePdfClickHandler() {
    ipcRenderer.send('save-pdf')
}

//save pdf

const openPDF = document.getElementById('pdfSave')
openPDF.addEventListener('click', savePdfClickHandler)

function openPdfClickHandler() {
    ipcRenderer.send('save-pdf')
}

//openPDF

const printPDFButton = document.getElementById('print-pdf')

printPDFButton.addEventListener('click', event => {
    ipcRenderer.send('print-to-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const message = `${path}`
    document.getElementById('pdf-path').innerHTML = message
})