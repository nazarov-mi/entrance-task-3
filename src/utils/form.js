
import copy from './copy'

export default class Form {
	constructor(fields, validators) {
		this._fields = fields
		this._validators = validators
		this._values = {}
		this._errors = {}

		this.reset()
	}

	reset() {
		const values = this._values

		this._fields.forEach(name => {
			values[name] = null
		})

		this.resetErrors()
	}

	resetErrors() {
		const errors = this._errors

		this._fields.forEach(name => {
			errors[name] = null
		})
	}

	setData(data) {
		const values = this._values

		this._fields.forEach(name => {
			if (data.hasOwnProperty(name)) {
				values[name] = copy(data[name])
			}
		})
	}

	validate() {
		const validators = this._validators
		const values = this._values
		const errors = this._errors

		this.resetErrors()

		this._isValid = this._fields.every(name => {
			const validator = validators[name]
			const error = validator && validator(values[name], values)

			if (error !== undefined) {
				this.errors[name] = error
				return false
			}

			return true
		})
	}


	// Getters / Setters
	///////////////////////////////////////

	get values() {
		return this._values
	}

	get errors() {
		return this._errors
	}

	get firstError() {
		const errors = this._errors

		if(!this._isValid) {
			for (let key in errors) {
				if (
					errors.hasOwnProperty(key) &&
					errors[key] != null
				) {
					return errors[key]
				}
			}
		}

		return undefined
	}

	get isValid() {
		return this._isValid
	}

	get isExist() {
		const id = this._values.id

		return id != null && id != ''
	}
}