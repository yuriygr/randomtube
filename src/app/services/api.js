import axios from 'axios'

/**
 * Небольшая обертка над Axios.
 * Потому что мне так удобно.
 * 
 * @author Боженька <god@heaven>
 * @version 2.0.0
 */

export default new class {
	options = {
		key:     false,
		baseURL: false,
		version: false,
		withCredentials: true
	}

	instance = false

	token = false

	install(app, options = {}) {
		this.options = { ...this.options, ...options }

		this.instance = axios.create({
			baseURL: this.options.baseURL + this.options.version + '/',
			withCredentials: this.options.withCredentials,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}
		})

		this.instance.interceptors.request.use(
			async (config) => {
				if (this.token) {
					config.headers = {
						...config.headers,
						authorization: `Bearer ${this.token}`,
					}
				}

				return config;
			},
			(error) => Promise.reject(error)
		)

		this.instance.interceptors.response.use(
			this.handleResponseSuccess,
			this.handleResponseError
		)

		app.config.globalProperties.$api = this
	}

	// Ничего не делает
	handleResponseSuccess(data) {
		return JSON.parse(data.request.response)
	}

	// Преобразует ошибочный ответ в что-то более приятное моему глазу
	handleResponseError(error) {
		// Сетевая ошибка — нет ответа от сервера
		if (!error.response) {
			return Promise.reject({
				code: error.code,
				status: error.code ?? 'network_error'
			})
		}
	
		const response = error.response.data
	
		return Promise.reject({
			code: response.code,
			status: response.error || response.status
		})
	}

	prepareGetData(params) {
    return new URLSearchParams(params).toString()
  }

	preparePostData(params) {
    let formData = new FormData()
    Object.keys(params).forEach(item => {
      formData.append(item, params[item])
    })

    return formData
  }

  /**
  * Скажу сразу, мне это все пиздец не нравится, так же как и вам.
  * Вот эта вот тупая заморозка параметров, ковыряение тегов, удаление устых полей объекта
  * По этому если есть желание - поправьте меня
  */
  prepareFiltersData(params) {
    let _params = Object.assign({}, params)

    _params.tags = _params.tags.map(x => x.value)

    Object.keys(_params).forEach(item => {
      if (_params[item] === '') {
        delete _params[item]
      }
    })
    return new URLSearchParams(_params).toString()
  }

	get(path, params = {}, signal = false) {
		return this.instance.get(path, { params, signal })
	}

  post(path, params = {}) {
    let formData = this.preparePostData(params)
    return this.instance.post(path, formData, {
      headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
  }

	upload(path, formdata, opt) {
		return this.instance.post(path, formdata, opt)
	}

  postJSON(path, json = {}, headers = {}) {
    return this.instance.post(path, json, {
			headers
		})
	}

	delete(path, params = {}) {
		return this.instance.delete(path, { params })
	}
} 