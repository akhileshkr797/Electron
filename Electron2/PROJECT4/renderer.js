const { ipcRenderer } = require('electron')

//open pdf

const pdf = document.getElementById('openPDF')
pdf.addEventListener('click', event => {
    ipcRenderer.send('open-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const msg = `${path}`
    document.getElementById('p01').innerHTML = msg
})

//save PNG
const pngSave = document.getElementById('savePNG')
pngSave.addEventListener('click', event => {
    ipcRenderer.send('save-png')
})

ipcRenderer.send('save-png2', (event, path) => {
    const msg3 = `${path}`
    document.getElementById('p01').innerHTML = msg3
})


//save pdf

const pdfSave = document.getElementById('savePDF')
pdfSave.addEventListener('click', event => {
    ipcRenderer.send('save-pdf')
})

ipcRenderer.on('save-pdf2', (event, path) => {
    const msg2 = `${path}`
    document.getElementById('p01').innerHTML = msg2
})