const { ipcRenderer } = require('electron')

setTimeout(() => {
    ipcRenderer.send('mainWindow-init')
}, 5000)


//open pdf
const printPDFButton = document.getElementById('print-pdf')

printPDFButton.addEventListener('click', event => {
    ipcRenderer.send('print-to-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const message = `${path}`
    document.getElementById('pdf-path').innerHTML = message
})