function App () {
	this.model = { "data": [ { "id": "X999_Y999", "from": { "name": "Tom Brady", "id": "X12" }, "message": "Looking forward to 2010!", "actions": [ { "name": "Comment", "link": "http://www.facebook.com/X999/posts/Y999" }, { "name": "Like", "link": "http://www.facebook.com/X999/posts/Y999" } ], "type": "status", "created_time": "2010-08-02T21:27:44+0000", "updated_time": "2010-08-02T21:27:44+0000" }, { "id": "X998_Y998", "from": { "name": "Peyton Manning", "id": "X18" }, "message": "Where's my contract?", "actions": [ { "name": "Comment", "link": "http://www.facebook.com/X998/posts/Y998" }, { "name": "Like", "link": "http://www.facebook.com/X998/posts/Y998" } ], "type": "status", "created_time": "2010-08-02T21:27:44+0000", "updated_time": "2010-08-02T21:27:44+0000" } ] }

	this.cash = {"json": null};

	this.build();
	this.render();
}

/**
 * Build working area
 */
App.prototype.build = function () {
	this.constructor = document.createElement("ul");
	this.constructor.id = "constructor";
	document.body.appendChild(this.constructor);

	this.textArea = document.createElement("textArea");
	this.textArea.addEventListener("keyup", this.onInputDataChanged.bind(this));
	this.textArea.className = "input";
	this.textArea.style.display = "none";
	this.textArea.placeholder = "Object in JSON format.";
	this.constructor.appendChild(this.textArea);

	this.buttons = document.createElement("div");
	this.buttons.id = "constructor_buttons";
	document.body.appendChild(this.buttons);

	this.buttons.new = document.createElement("button");
	this.buttons.new.addEventListener("mouseup", this.onNewClicked.bind(this));
	this.buttons.new.innerText = "New";
	this.buttons.appendChild(this.buttons.new);

	this.buttons.inJSON = document.createElement("button");
	this.buttons.inJSON.addEventListener("mouseup", this.onInJsonClicked.bind(this));
	this.buttons.inJSON.innerText = "inJSON";
	this.buttons.appendChild(this.buttons.inJSON);

	this.buttons.save = document.createElement("button");
	this.buttons.save.addEventListener("mouseup", this.onSaveClicked.bind(this));
	this.buttons.save.innerText = "Save";
	this.buttons.appendChild(this.buttons.save);

	this.buttons.load = document.createElement("button");
	this.buttons.load.addEventListener("mouseup", this.onLoadClicked.bind(this));
	this.buttons.load.innerText = "Load";
	this.buttons.appendChild(this.buttons.load);

	this.constructor.addEventListener("mouseup", this.onObjectClick.bind(this));
};

/**
 * Create new object or property step by step in 2-3 steps
 * @returns {HTMLElement} new objector property
 */
App.prototype.create = function (parent) {
	var id = prompt("Please type name of object/property...") || "new",
		type = confirm("Please press ok if you need an object and press cancel to create property.");

	if (type) {
		parent.link.parent[parent.link.id][id] = new Object();
	} else {
		parent.link.parent[parent.link.id][id] = prompt("Please type value of property.");
	}

	this.render();
};

/**
 * Will remove builded object.
 * In case clear button pressed will remove all from working area (input and etc.)
 * @param fully nothing or anything, even events
 */
App.prototype.clear = function (fully) {
	var content = this.constructor.getElementsByClassName("object");

	this.cash.json = null;

	if (content.length > 0) {
		content[0].remove();
		this.clear();
	}
};

/**
 * Remove object or property
 */
App.prototype.remove = function (parent) {
	delete parent.link.parent[parent.link.id];
	this.render();
};

/**
 * Render DOM tree
 */
App.prototype.render = function () {
	var rendered = this.buildObject(this, "model");

	this.clear();

	if (this.constructor.childElementCount > 0) {
		this.constructor.insertBefore(rendered, this.constructor.firstChild);
	} else {
		this.constructor.appendChild(rendered);
	}

	this.textArea.value = JSON.stringify(this.model, null, 4);
};

/**
 * Build object
 * @param object needed object
 * @param id name of object (id)
 * @returns {HTMLElement}
 */
App.prototype.buildObject = function (parent, id) {
	(new Validator(id)).notUndefined().notNull().isString();
	(new Validator(parent[id])).notUndefined();

	var add = document.createElement("img"),
		label = document.createElement("label"),
		remove = document.createElement("img"),
		response = document.createElement("ul");

	add.className = "add";
	add.src = "./assets/add.png";
	label.textContent = "\"" + id + "\"";
	remove.className = "remove";
	remove.src = "./assets/remove.png";
	response.className = "object expand";

	response.appendChild(label);
	response.appendChild(add);
	response.appendChild(remove);

	response.link = { "id": id, "parent": parent };

	for (var name in parent[id]) {
		if (typeof parent[id][name] == "object") {
			response.appendChild(this.buildObject(parent[id], name));
		} else {
			response.appendChild(this.buildProperty(parent[id], name));
		}
	}

	return response;
};

/**
 * Build property
 * @param property needed property
 * @param id name of property (id)
 * @returns {HTMLElement}
 */
App.prototype.buildProperty = function (parent, id) {
	(new Validator(id)).notUndefined().notNull().isString();
	(new Validator(parent[id])).notUndefined();

	var label = document.createElement("label"),
		remove = document.createElement("img"),
		response = document.createElement("li");

	label.textContent = "\"" + id + "\": \"" + parent[id] + "\"";
	remove.className = "remove";
	remove.src = "./assets/remove.png";
	response.className = "property expand";
	response.appendChild(label);
	response.appendChild(remove);

	response.link = { "id": id, "parent": parent };

	return response;
};

/**
 * Click listener for al objects
 * @param event
 */
App.prototype.onObjectClick = function(event) {
	var target = event.target,
		parent = target.parentElement;

	if (target.className.indexOf("add") > -1) {
		this.create(parent);
	} else if (target.className.indexOf("remove") > -1) {
		this.remove(parent);
	} else if (target.className.indexOf("object")) {
		if (parent.className.indexOf("expand") > -1) {
			parent.className = parent.className.replace("expand", "collapse");
		} else if (parent.className.indexOf("collapse") > -1) {
			parent.className = parent.className.replace("collapse", "expand")
		}
	}
};

/**
 * Click listener for button "create new" button
 */
App.prototype.onNewClicked = function() {
	this.model = new Object();
	this.render();
};

/**
 * Click listener for "in JSON" button
 */
App.prototype.onInJsonClicked = function() {
	if (this.textArea.style.display == "none") {
		this.textArea.style.display = "block";
		this.textArea.value = JSON.stringify(this.model, null, 4);

		this.textArea.focus();
	} else {
		this.textArea.style.display = "none";
	}
};

/**
 * Listener for "save" button
 */
App.prototype.onSaveClicked = function () {
	localStorage.model = JSON.stringify(this.model);
};

/**
 * Listener for "load" button
 */
App.prototype.onLoadClicked = function () {
	if (localStorage.constructor) {
		this.model = JSON.parse(localStorage.model);
		this.render();
	}
};

/**
 * Listener for changing data in textarea
 * @param event
 */
App.prototype.onInputDataChanged = function (event) {
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

	this.model = parsedData;
	this.render();
};