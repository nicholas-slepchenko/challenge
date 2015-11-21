function ObjectConstructor (target) {
	(new Validator(target)).notUndefined().notNull();

	var self = this;

	this.mode = null;
	this.cash = {
		"json": null
	};

	this.node = target;

	// switching cases, from expand to collapse and back
	this.node.addEventListener("mouseup", function(event) {
		var target = event.target,
			parent = target.parentElement;

		if (target.className.indexOf("add") > -1) {
			parent.appendChild(self.buildObject({}, "newObject"));
		} else if (target.className.indexOf("remove") > -1) {

		} else if (target.className.indexOf("object")) {
			if (parent.className.indexOf("expand") > -1) {
				parent.className = parent.className.replace("expand", "collapse");
			} else if (parent.className.indexOf("collapse") > -1) {
				parent.className = parent.className.replace("collapse", "expand")
			}
		}
	}, false);
}

ObjectConstructor.prototype.newOne = function () {
	this.clear(true);
	this.node.appendChild(this.buildObject({}, "object"));
};

/**
 * Will remove builded object.
 * In case clear button pressed will remove all from working area (input and etc.)
 * @param fully nothing or anything, even events
 */
ObjectConstructor.prototype.clear = function (fully) {
	var content = this.node.getElementsByClassName("object"),
		input = this.node.getElementsByClassName("input");

	this.cash.json = null;

	if (content.length > 0) {
		content[0].remove();
		this.clear();
	}

	if (fully) {
		if (input[0]) {
			input[0].remove();
		}

		this.mode = null;
	}
};

ObjectConstructor.prototype.buildObject = function (object, id) {
	(new Validator(object)).notUndefined().notNull().isObject();
	(new Validator(id)).notUndefined().notNull().isString();

	var add = document.createElement("img"),
		label = document.createElement("label"),
		remove = document.createElement("img"),
		response = document.createElement("ul");


	add.src = "./assets/add.png";
	add.className = "add";
	remove.src = "./assets/remove.png";
	remove.className = "remove";
	label.textContent = "\"" + id + "\"";
	response.className = "object expand";

	response.appendChild(label);
	response.appendChild(add);
	response.appendChild(remove);

	for (var id in object) {
		if (typeof object[id] == "object") {
			response.appendChild(this.buildObject(object[id], id));
		} else {
			response.appendChild(this.buildProperty(object[id], id));
		}
	}

	return response;
};

ObjectConstructor.prototype.buildProperty = function (property, id) {
	(new Validator(property)).notUndefined();
	(new Validator(id)).notUndefined().notNull().isString();

	var label = document.createElement("label"),
		response = document.createElement("li");

	label.textContent = "\"" + id + "\": " + property;
	response.parent.className = "property expand";
	response.appendChild(label);

	return response;
};

ObjectConstructor.prototype.toJSON = function (data) {
	alert("Will be soon!");
};

ObjectConstructor.prototype.fromJSON = function (data) {
	if (this.mode != "fromJSON") {
		this.mode = "fromJSON";

		this.clear();

		// create JSON input
		this.textArea = document.createElement("textArea");
		this.textArea.parent.className = "input";
		this.textArea.placeholder = "Insert or type your object in JSON format.";
		this.textArea.addEventListener("keyup", this.onInputDataChanged.bind(this));
		this.node.appendChild(this.textArea);
	}

	this.textArea.focus();

	// TEMP: dummy
	//this.textArea.value = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';
};

ObjectConstructor.prototype.onInputDataChanged = function (event) {
	var	parsedData = null;

	if (this.cash.json == event.target.value) {
		return;
	}

	this.clear();

	this.cash.json = event.target.value;

	try {
		parsedData = JSON.parse(event.target.value);
	} catch (error) {
		console.warn(error);
		return;
	}

	if (parsedData instanceof Array) {
		console.warn("JSON inside input (textArea) must be an object!");
		return;
	}

	var result = this.buildObject(parsedData, "object");
	this.node.insertBefore(result, this.node.firstChild);
};