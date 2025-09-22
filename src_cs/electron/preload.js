const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

const appRoot = path.join(__dirname, '..', '..').replace(/\\/g, '/');

contextBridge.exposeInMainWorld('nativeAPI', {
  startCore: () => ipcRenderer.invoke('core-start'),
  stopCore: () => ipcRenderer.invoke('core-stop'),
  appRoot: appRoot
});

// Rewrite absolute asset URLs (starting with /) to file:// paths rooted at the repository root
// This allows the existing index.html to keep using /asset/... and /assets/... paths
window.addEventListener('DOMContentLoaded', () => {
  try {
    const attrs = ['src', 'href'];
    attrs.forEach(attr => {
      document.querySelectorAll('[' + attr + ']').forEach(el => {
        const v = el.getAttribute(attr);
        if (v && v.startsWith('/')) {
          // build file URL relative to appRoot
          const filePath = 'file://' + appRoot + v;
          el.setAttribute(attr, filePath);
        }
      });
    });
  } catch (e) {
    // ignore
    console.error('preload rewrite error', e);
  }
});
