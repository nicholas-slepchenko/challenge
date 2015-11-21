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
			parent.appendChild(self.create());
		} else if (target.className.indexOf("edit") > -1) {
			self.edit(parent);
		} else if (target.className.indexOf("remove") > -1) {
			parent.remove();
		} else if (target.className.indexOf("object")) {
			if (parent.className.indexOf("expand") > -1) {
				parent.className = parent.className.replace("expand", "collapse");
			} else if (parent.className.indexOf("collapse") > -1) {
				parent.className = parent.className.replace("collapse", "expand")
			}
		}
	}, false);
}

/**
 * Add new empty object in working area, will remove old object if it's exist
 */
ObjectConstructor.prototype.newOne = function () {
	this.clear(true);
	this.node.appendChild(this.buildObject({}, "object"));
};

/**
 * Create new object or property step by step in 2-3 steps
 * @returns {HTMLElement} new objector property
 */
ObjectConstructor.prototype.create = function () {
	var response = null,
		id = prompt("Please type name of object/property...") || "new",
		type = confirm("Please press ok if you need an object and press cancel to create property.");

	if (type) {
		response = this.buildObject({}, id);
	} else {
		response = this.buildProperty(prompt("Please type value of property."), id);
	}

	return response;
};

/**
 * Edit selected object or property
 * @param target - selected object oe property
 * @return {HTMLElement} edited object
 */
ObjectConstructor.prototype.edit = function (target) {
	var result = this.create();

	target.getElementsByTagName("label")[0].textContent = result.getElementsByTagName("label")[0].textContent;

	var content = target.innerHTML;

	if (result.className.indexOf("object") > -1) {
		result.innerHTML = content;
	}

	target.outerHTML = result.outerHTML;

	return target;
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

/**
 * Build new object
 * @param object needed object
 * @param id name of object (id)
 * @returns {HTMLElement}
 */
ObjectConstructor.prototype.buildObject = function (object, id) {
	(new Validator(object)).notUndefined().notNull().isObject();
	(new Validator(id)).notUndefined().notNull().isString();

	var add = document.createElement("img"),
		label = document.createElement("label"),
		remove = document.createElement("img"),
		response = document.createElement("ul"),
		edit = document.createElement("img");

	add.className = "add";
	add.src = "./assets/add.png";
	edit.className = "edit";
	edit.src = "./assets/edit.png";
	label.textContent = "\"" + id + "\"";
	remove.className = "remove";
	remove.src = "./assets/remove.png";
	response.className = "object expand";

	response.appendChild(label);
	response.appendChild(add);
	response.appendChild(edit);
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

/**
 * Build new property
 * @param property needed property
 * @param id name of property (id)
 * @returns {HTMLElement}
 */
ObjectConstructor.prototype.buildProperty = function (property, id) {
	(new Validator(property)).notUndefined();
	(new Validator(id)).notUndefined().notNull().isString();

	var edit = document.createElement("img"),
		label = document.createElement("label"),
		remove = document.createElement("img"),
		response = document.createElement("li");

	edit.className = "edit";
	edit.src = "./assets/edit.png";
	label.textContent = "\"" + id + "\": " + property;
	remove.className = "remove";
	remove.src = "./assets/remove.png";
	response.className = "property expand";
	response.appendChild(label);
	response.appendChild(edit);
	response.appendChild(remove);

	return response;
};

ObjectConstructor.prototype.toJSON = function () {
	for(var element in this.node) {
		console.log(element);
	}
};

/**
 * Will create textarea which will be used for create object
 */
ObjectConstructor.prototype.fromJSON = function () {
	if (this.mode != "fromJSON") {
		this.mode = "fromJSON";

		this.clear();

		// create JSON input
		this.textArea = document.createElement("textArea");
		this.textArea.className = "input";
		this.textArea.placeholder = "Insert or type your object in JSON format.";
		this.textArea.addEventListener("keyup", this.onInputDataChanged.bind(this));
		this.node.appendChild(this.textArea);

		this.textArea.focus();
	} else {
		this.textArea.remove();
		this.textArea = null;
		this.mode = null;
	}
};

/**
 * Listener for changing data in textarea
 * @param event
 */
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