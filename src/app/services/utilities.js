export const cancelEvent = (event) => {
  event = event || window.event
  if (event) {
    event = event.originalEvent || event

    if (event.stopPropagation) event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
      event.returnValue = false
      event.cancelBubble = true
  }

  return false
}

export const isObject = (val) => {
  if (val === null) { return false }
  return ( (typeof val === 'function') || (typeof val === 'object') )
}

export const isArray = (val) => {
  return value && typeof value === 'object' && value.constructor === Array;
}

export const getScrollTopElement = (e) => {
  let top = 0
  while (e.offsetParent != undefined || e.offsetParent != null) {
    top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0)
    e = e.offsetParent
  }
  return top
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

export const captureVideoFrame = (video, format, quality) => {
  if (typeof video === 'string') {
    video = document.getElementById(video);
  }

  format = format || 'jpeg';
  quality = quality || 0.92;

  if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false;
  }

  var canvas = document.createElement("CANVAS");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d').drawImage(video, 0, 0);

  var dataUri = canvas.toDataURL('image/' + format, quality);
  var data = dataUri.split(',')[1];
  var mimeType = dataUri.split(';')[0].slice(5)

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var arr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  var blob = new Blob([ arr ], { type: mimeType });
  return { blob: blob, dataUri: dataUri, format: format };
}