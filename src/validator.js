/**
 * Validator for any value.
 *
 * Example:
 * var validator = new Validator(someValue);
 * validator.notUndefined().notNull().isNumber().moreThan(0).lessThan(100);
 *
 * @param value
 * @constructor
 */
function Validator (value) {
	this.value = value;
	this.message = "Validation failed!";

	this.notNull = function () {
		if (this.value === null) throw this.message;
		return this;
	};
	this.notUndefined = function () {
		if (this.value === undefined) throw this.message;
		return this;
	};
	this.isObject = function () {
		if (typeof this.value != "object") throw this.message;
		return this;
	};
	this.isString = function () {
		if (typeof this.value != "string") throw this.message;
		return this;
	};
	this.isNode = function () {
		if (!(this.value instanceof Node)) throw this.message;
		return this;
	};
}