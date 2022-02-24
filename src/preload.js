import { ipcRenderer } from 'electron'
import * as EStore  from 'electron-store'

window.ipcRenderer = ipcRenderer
window.eStore = new EStore()

