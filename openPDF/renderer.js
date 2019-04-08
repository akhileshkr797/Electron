const { ipcRenderer } = require('electron')

//splashWindow
setTimeout(() => {
    ipcRenderer.send('get-mainWindow')
}, 5000)


//print-to-pdf
const printPDFButton = document.getElementById('print-pdf')

printPDFButton.addEventListener('click', event => {
    ipcRenderer.send('print-to-pdf')
})

ipcRenderer.on('wrote-pdf', (event, path) => {
    const message = `${path}`
    document.getElementById('pdf-path').innerHTML = message
})

//pdf