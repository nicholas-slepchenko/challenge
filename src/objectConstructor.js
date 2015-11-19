function ObjectConstructor (target) {
	(new Validator(target)).notUndefined().notNull();

	this.cash = {
		"json": null
	};

	this.node = target;
}

ObjectConstructor.prototype.buildObject = function (target, object, id) {
	(new Validator(target)).notUndefined().notNull().isNode();
	(new Validator(object)).notUndefined().notNull().isObject();
	(new Validator(id)).notUndefined().notNull().isString();

	var label = document.createElement("label"),
		response = document.createElement("ul");

	label.textContent = id;
	response.className = "object";
	response.appendChild(label);

	return response;
};

ObjectConstructor.prototype.buildProperty = function (target, property) {

};

ObjectConstructor.prototype.fromJSON = function (data) {
	// create JSON input
	this.textArea = document.createElement("textArea");
	this.textArea.placeholder = "Insert or type your object in JSON format.";
	this.textArea.addEventListener("keyup", this.onInputDataChanged.bind(this));
	this.node.appendChild(this.textArea);

	// TEMP: dummy
	//textArea.value = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';
};

ObjectConstructor.prototype.onInputDataChanged = function (event) {
	var	parsedData = null;

	if (this.cash.json == event.target.value) return;
	else this.cash.json = event.target.value;

	try { parsedData = JSON.parse(event.target.value); } catch (error) {
		return;
	}

	if (parsedData instanceof Array) {
		console.warn("JSON inside input (textArea) must be an object!");
		return;
	}

	var result = this.buildObject(this.node, parsedData, "Object");
	console.log(result);
	this.node.appendChild(result);
};