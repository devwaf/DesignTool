const path=require('path')

let pyProc = null
let pyPort = null

export const createPyProc = () => {
  let port = '4242'
  let script = path.join(__dirname, 'api.py')
  pyProc = require('child_process').spawn('python', [script, port])
  if (pyProc != null) {
    console.log('child process success')
  }
}

export const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}
