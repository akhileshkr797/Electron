const { ipcRenderer } = require('electron')

//file open

const fileOpn = document.getElementById('select-directory')
fileOpn.addEventListener('click', function(event) {
    ipcRenderer.send('selectFile')
})

ipcRenderer.on('selectedItem', function(event, path) {
    document.getElementById('selectedItem').innerHTML = `you selected...   ${path}`
})