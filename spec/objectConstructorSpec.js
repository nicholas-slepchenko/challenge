describe("ObjectConstructor", function() {
	it("ObjectConstructor initialized", function() {
		var target = document.createDocumentFragment(),
			constructor = document.createElement("ul");

		constructor.id = "constructor";
		target.appendChild(constructor);

		expect(new ObjectConstructor(target).node).not.toBe(undefined);
		expect(new ObjectConstructor(target).node).not.toBe(null);
	});

	it("ObjectConstructor initialized", function() {
		var target = document.createDocumentFragment(),
			constructor = document.createElement("ul");

		constructor.id = "constructor";
		target.appendChild(constructor);

		expect(new ObjectConstructor(target).node).not.toBe(undefined);
		expect(new ObjectConstructor(target).node).not.toBe(null);
	});
});