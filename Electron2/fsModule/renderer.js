const { ipcRenderer } = require('electron')

/*Open Directory*/
const clkMSG = document.getElementById('clk')
clkMSG.addEventListener('click', function(event) {
    ipcRenderer.send('fileMsg')
})

ipcRenderer.on('selected', function(event, path) {
    document.getElementById('info').innerHTML = `You selected  ${path}`
})