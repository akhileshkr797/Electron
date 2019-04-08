const { ipcRenderer } = require('electron')


//save png
const pngSave = document.getElementById('savePNG')
pngSave.addEventListener('click', event => {
    ipcRenderer.send('save-png')
})

//save pdf
const pdfSave = document.getElementById('savePDF')
pdfSave.addEventListener('click', event => {
    ipcRenderer.send('save-pdf')
})

//open pdf

const pdfOpen = document.getElementById('openPDF')
pdfOpen.addEventListener('click', event => {
    ipcRenderer.send('open-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const msg = `${path}`
    document.getElementById('p01').innerHTML = msg
})