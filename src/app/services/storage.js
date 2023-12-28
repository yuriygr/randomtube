/**
 * Небольшая обертка над localforage.
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
	options = {}

	install(app, options = {}) {
		this.options = { ...this.options, ...options }
	
		app.config.globalProperties.$storage = localStorage
	}
}