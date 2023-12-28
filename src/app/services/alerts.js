import mitt from 'mitt';

/**
 * Небольшая обертка над Mitt.
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.3
 */
export default new class {
  options = {
    key: 'alerts',
    defaultTimeout: 3500
  }

  bus = false

  install(app, options = {}) {
    this.options = { ...this.options, ...options }

    this.bus = mitt()
  
    app.config.globalProperties.$alerts = this
  }

  success(payload) {
    this.add({ ...payload, type: 'success' })
  }

  info(payload) {
    this.add({ ...payload, type: 'info' })
  }

  danger(payload) {
    this.add({ ...payload, type: 'danger' })
  }

  add(payload) {
    if (!payload.timeout)
      payload = { ...payload, timeout: this.options.defaultTimeout }

    this.bus.emit(this.options.key, payload)
  }

  on(callback) {
    this.bus.on(this.options.key, callback)
  }

  off() {
    this.bus.off(this.options.key)
  }
}