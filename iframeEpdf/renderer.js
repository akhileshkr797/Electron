const { ipcRenderer } = require('electron')

const printPDF = document.getElementById('generateReport')

printPDF.addEventListener('click', printButtonClickHandler)

function printButtonClickHandler() {
    ipcRenderer.send('pdf')
}