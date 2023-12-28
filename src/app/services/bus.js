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
	
		app.config.globalProperties.$bus = this
	}

	emit(id, payload) {
		this.bus.emit(id, payload)
	}

	on(id, callback) {
		this.bus.on(id, callback)
	}

	off(id) {
		this.bus.off(id)
	}
}