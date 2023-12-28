import mitt from 'mitt';

/**
 * Небольшая обертка над Mitt.
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
  options = {}

  bus = false

  install(app, options = {}) {
    this.options = { ...this.options, ...options }

    this.bus = mitt()

    app.config.globalProperties.$popover = this
  }

  open(payload) {
    this.emit('open', payload)
  }

  close() {
    this.emit('close')
  }

	emit(id, payload) {
		this.bus.emit('popover:' + id, payload)
	}

	on(id, callback) {
		this.bus.on('popover:' + id, callback)
	}

	off(id) {
		this.bus.off('popover:' + id)
	}
}