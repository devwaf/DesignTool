const { app, BrowserWindow,Menu } = require('electron')
const path = require("path")
function createWindow () {
    const win = new BrowserWindow({
        width: 1960,
        height: 1080
    })
    Menu.setApplicationMenu(null)
    win.loadFile(path.join(__dirname,"index.html"))
}


require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});


app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})