import VueGtag from 'vue-gtag'

// app components & services
import { router, directives, filters, store, global_ui, i18n } from '@/app/components'
import { api, alerts, modals, popover, bus, storage } from '@/app/services'

// probrasivaem-s
store.$api = api
store.$storage = storage

/**
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 1.0.1
 */
export default new class {
	options = {
    gtag: {
      config: {
        id: process.env.VUE_APP_GTAG_ID,
        params: {
          anonymize_ip: process.env.VUE_APP_GTAG_ANONYMIZE_IP
        }
      }
    },
    api: {
      key:     process.env.VUE_APP_API_KEY,
      baseURL: process.env.VUE_APP_API_ENDPOINT,
      version: process.env.VUE_APP_API_VERSION
    },
    bus: {
    	openSwitchBoard: 'switchBoard:open'
    }
  }

  install(app, options = {}) {
		this.options = { ...this.options, ...options }

    app.use(router)
    app.use(directives)
    app.use(filters)
    app.use(store)
    app.use(global_ui)
    app.use(i18n)
  
    app.use(VueGtag, this.options.gtag)
  
    app.use(api, this.options.api)
    app.use(alerts)
    app.use(modals)
    app.use(popover)
    app.use(bus, this.options.bus)
    app.use(storage)
  }
}