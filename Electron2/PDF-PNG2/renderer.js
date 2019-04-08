const { ipcRenderer } = require('electron')

//save png

const pngSave = document.getElementById('savePNG')
pngSave.addEventListener('click', event => {
    ipcRenderer.send('save-png')
})

ipcRenderer.on('wrote-png', (event, path) => {
    const smg = `${path}`
    document.getElementById('p01').innerHTML = smg
})

//save pdf
const pdfSave = document.getElementById('savePDF')
pdfSave.addEventListener('click', event => {
    ipcRenderer.send('save-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const msg = `${path}`
    document.getElementById('p01').innerHTML = msg
})




//open pdf
const pdf = document.getElementById('openPDF')
pdf.addEventListener('click', event => {
    ipcRenderer.send('open-pdf')
})

ipcRenderer.on('wrote-pdf2', (event, path) => {
    const msg2 = `${path}`
    document.getElementById('p01').innerHTML = msg2
})

//get all information