import mitt from 'mitt';

/**
 * Небольшая обертка над Mitt.
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
	bus = false

	install(app, methods = {}) {
		this.bus = mitt()

		Object.assign(this, methods)
	
		app.config.globalProperties.$modals = this
	}

  show(component, props = {}, onClose = () => {}) {
    this.bus.emit('modals:show', { component, props, onClose })
  }

  close() {
    this.bus.emit('modals:close')
  }

	on(id, callback) {
		this.bus.on('modals:' + id, callback)
	}

	off(id) {
		this.bus.off('modals:' + id)
	}
}