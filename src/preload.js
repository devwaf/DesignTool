import { ipcRenderer,ipcMain } from 'electron'
import * as EStore  from 'electron-store'

window.ipcRenderer = ipcRenderer
window.ipcMain = ipcMain
window.eStore = new EStore()

