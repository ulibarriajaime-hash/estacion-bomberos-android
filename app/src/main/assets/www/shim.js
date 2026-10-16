/*
 * Adaptador para la app de Android.
 * Las páginas guardan archivos con window.claude.use('downloads').save({filename, data}).
 * Aquí se implementa esa llamada con el puente nativo AndroidBridge, que escribe en Descargas.
 */
(function () {
  'use strict';
  if (window.claude || !window.AndroidBridge) return;

  var MIME = {
    csv: 'text/csv', svg: 'image/svg+xml', png: 'image/png', json: 'application/json',
    txt: 'text/plain', md: 'text/markdown', html: 'text/html', pdf: 'application/pdf',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp'
  };
  function mimeOf(name) {
    var m = /\.([A-Za-z0-9]+)$/.exec(name || '');
    return (m && MIME[m[1].toLowerCase()]) || 'application/octet-stream';
  }
  function bytesToB64(bytes) {
    var s = '', step = 0x8000;
    for (var i = 0; i < bytes.length; i += step) {
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
    }
    return btoa(s);
  }
  function toBase64(data) {
    return new Promise(function (resolve, reject) {
      if (typeof data === 'string') { resolve(bytesToB64(new TextEncoder().encode(data))); return; }
      if (typeof Blob !== 'undefined' && data instanceof Blob) {
        var r = new FileReader();
        r.onload = function () { var u = String(r.result); resolve(u.slice(u.indexOf(',') + 1)); };
        r.onerror = function () { reject({ code: 'bad_request', message: 'No se pudo leer el archivo' }); };
        r.readAsDataURL(data);
        return;
      }
      if (data instanceof ArrayBuffer) { resolve(bytesToB64(new Uint8Array(data))); return; }
      if (ArrayBuffer.isView(data)) { resolve(bytesToB64(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))); return; }
      reject({ code: 'bad_request', message: 'Tipo de dato no admitido' });
    });
  }

  var pending = {}, seq = 0;
  window.__bomberosSaveResult = function (id, ok) {
    var p = pending[id];
    if (!p) return;
    delete pending[id];
    if (ok) p.resolve({ status: 'saved' });
    else p.reject({ code: 'unavailable', message: 'No se pudo guardar el archivo' });
  };

  var downloads = {
    save: function (req) {
      return toBase64(req && req.data).then(function (b64) {
        return new Promise(function (resolve, reject) {
          var id = ++seq, name = String((req && req.filename) || 'archivo');
          pending[id] = { resolve: resolve, reject: reject };
          try { window.AndroidBridge.saveFile(id, name, mimeOf(name), b64); }
          catch (e) { delete pending[id]; reject({ code: 'unavailable', message: String(e) }); }
        });
      });
    }
  };

  window.claude = {
    use: function (name) { return Promise.resolve(name === 'downloads' ? downloads : null); }
  };
})();
