const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let coreProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // Load the project's index.html (relative path)
  const indexPath = path.join(__dirname, '..', '..', 'index.html');
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('core-start', async (event, args) => {
  if (coreProcess) return { ok: false, msg: 'core already running' };
  const exePath = path.join(__dirname, '..', 'publish', 'PixelHarvest.Core.exe');
  coreProcess = spawn(exePath, [], { windowsHide: true });
  coreProcess.stdout.on('data', (d) => console.log(`[core] ${d.toString()}`));
  coreProcess.stderr.on('data', (d) => console.error(`[core-err] ${d.toString()}`));
  coreProcess.on('exit', (code) => { coreProcess = null; console.log(`core exited ${code}`); });
  return { ok: true };
});

ipcMain.handle('core-stop', async () => {
  if (!coreProcess) return { ok: false, msg: 'not running' };
  coreProcess.kill();
  coreProcess = null;
  return { ok: true };
});
