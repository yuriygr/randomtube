const humanizeError = (error) => {
  const snakeCase = string => {
    return string.replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  }

  let _code = snakeCase(error.status)

  return {
    icon: `errors.${_code}.icon`,
    title: `errors.${_code}.title`,
    description: `errors.${_code}.description`
  }
}

const timeFormat = (timestamp) => {
  const a = new Date(timestamp * 1000);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const year = a.getFullYear() < (new Date()).getFullYear() ? ' ' + a.getFullYear() : '';
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  const time = date + ' ' + month + year + ' at ' + hour + ':' + min;
  return time;
}

const formatBytes = (bytes, decimals) => {
  if (bytes == 0) return '0 Bytes'
  let k = 1024,
    dm = decimals || 1,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(':')
}

let filters = { humanizeError, timeFormat, formatBytes, formatDuration }

export default new class {
  install(app) {
    Object.keys(filters).forEach((key) => 
      app.config.globalProperties.$filters = {
        ...app.config.globalProperties.$filters,
        [key]: filters[key]
      }
    )
  }
}