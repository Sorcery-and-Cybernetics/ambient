# Ambient Testing Design

Ambient supports modular and event-driven testing. Tests can be placed in dedicated files (usually in a `tests/` folder) or defined directly in modules using `.ontest` event handlers. The root module can include tests conditionally (e.g., with a `debugmode` flag).

## How to Write Tests
- Use `.ontest("modulename", function(_){ ... })` in any module.
- Assert with:
 --`this.test(actual)` and related methods (`is`, `isnot`, `has`, `hasnot`).
 --`this.assert(actual, expected, message)` 
- Use `this.group("title")` to group tests.

### Example: Inline Test Handler
```js
_.ambient.module("testobject", function(_) {
    // ...object and trait definitions...
})
.ontest("testobject", function(_) {
    var object1 = _.model.object().name("Test Object")

    this.group("Test")
    this.test(object1.name()).is("Test Object", "Name should be 'Test Object' in test")

    this.group("Assert")
    this.assert(object1.name(), "Test Object", "Name should be 'Test Object' in assert")
})
```

### Example: Root Module Including Tests
```js
_.ambient.rootmodule("oop/")
    .require("sourcery/core/base/")
    .include("object/")
    .include("tests/", "debugmode")
```

## Running Tests
- The `unittest.js` module collects and runs all tests, supports async, grouping, and outputs results via `_.debug`.

## Best Practices
- Keep tests simple and readable.
- Group related tests.
- Use dedicated files or inline event handlers as needed.

Ambient's approach makes it easy to add, run, and report tests anywhere in the codebase.
