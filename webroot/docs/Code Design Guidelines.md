
## Purpose
Defines the style and structure for Sorcery Ambient `sourcery` modules. All contributors must follow these rules for clarity and consistency.

## Default Header (for all files)
Include this at the top of each file so both humans and AI tools follow the project style:

//**************************************************************************************************
// Ambient - Copyright (c) 1994-2025 Sorcery and Cybernetics (SAC). All rights reserved.
// See codedesign.md - Be Basic! ES2017; no caps; privates _name; library/global funcs _.name; no arrows, semicolons, let/const, underscores (except privates), or 3rd-party libs; 1-based lists; {} for if; spaced blocks; modules via _.ambient.module; objects/behaviors via _.define.object & _.behavior; events via _.signal()
//**************************************************************************************************

## Style Rules
- **Philosophy:** *Be Basic!* — simple, clear, minimal ES2017 JavaScript.
- **Naming:**
  - No capitals in function/variable names.
  - Privates start with `_`.
  - Library/global functions prefixed with `_.`.
- **Syntax:**
  - No arrow functions, no semicolons, no underscores except privates.
  - No `let`/`const`, no third-party libraries.
  - Use 1-based lists where applicable.
- **Formatting:**
  - Always use `{}` for `if`.
  - Single empty lines separate logical blocks.
  - Short statements may be on one line.

## Structure
- Modules defined with:
  ```js
  _.ambient.module("name", function(_) { ... })
  ```
- Objects via `_.define.object(supermodel, fn)`.
- Behaviors via `_.behavior(fn)`.
- Properties via `_.model.property()` or `_.model.*()`.
- Methods via `function()` or `_.method(fn)`.
- Events via `_.signal()`.


## Example
```javascript
_.ambient.module("exampleclass", function(_) {
  _.define.object("exampleclass", function(supermodel) {
    // Properties
    this.isroot = _.model.property(false)
    this.parent = _.model.property()
    this.count = _.model.number(0)  // trait

    // Behaviors
    this.objectbehavior = _.behavior(function() {
      this.construct = function() { /* constructor */ }
      this.destroy = function() { return null }
    })

    this.classbehavior = _.behavior(function() {
      this.add = method(function(value) {
        this.count(this.count() + (value || 1))
      })
      this.subtract = method(function(value) {
        this.count(this.count() - (value || 1))
      })
    })

    // Event Handler
    this.onchange = _.signal()
  })
})
```
