
const copy = value => {
	if (value instanceof Array) {
		return value.map(el => copy(el))
	} else
	if (value instanceof Object) {
		return Object.keys(value)
			.reduce((res, key) => {
				res[key] = copy(value[key])
				return res
			}, {})
	}

	return value
}

export default copy