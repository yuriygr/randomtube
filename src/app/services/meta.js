/**
 * Да, но куда деваться.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {

  defaultOptions = {
    defaultTitle: false,
    separator: '—'
  }

  createMixin(options = {}) {
    return {
      methods: {
        changeDataset(key, value) {
          if (value == false) {
            delete document.documentElement.dataset[key]
            return
          }
          document.documentElement.dataset[key] = value
        },
        changeTitle(value) {
          document.title = value + (options.defaultTitle ? ` ${options.separator} ${options.defaultTitle}` : '')
        },
        changeMeta(key, value) {
          document.querySelector(`meta[name="${key}"]`).setAttribute("content", value)
        },

        // Получаем теги
        _getMetatags(vm) {
          const meta = vm.$options.meta
          if (meta) {
            return typeof meta === 'function' ? meta.call(vm) : meta
          }
        },
        // Создаем теги
        _createMetatags() {
          const meta = this._getMetatags(this)
          if (!meta) return

          if (meta.title) this.changeTitle(meta.title)
          if (meta.description) this.changeMeta('description', meta.description)
        },
        // Меняем заголовок
        _changeMetaTitle() {
          const meta = this._getMetatags(this)
          if (!meta) return
          if (meta.title) this.changeTitle(meta.title)
        },
        // Меняем тег описания
        _changeMetaDescription() {
          const meta = this._getMetatags(this)
          if (!meta) return
          if (meta.description) this.changeMeta('description', meta.description)
        }
      },
      created() {
        this._createMetatags()
      },
      watch: {
        'meta.title': '_changeMetaTitle',
        'meta.description': '_changeMetaDescription'
      }
    }
  }

	install(app, options = {}) {
    app.mixin(this.createMixin({...this.defaultOptions, ...options}))
	}
}