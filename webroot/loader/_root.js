//*************************************************************************************************
// loaderroot - Copyright (c) 2024 SAC. All rights reserved.
//*************************************************************************************************
var loaderpath = "./" 

require(loaderpath + "loader.js")
require(loaderpath + "base.js")
require(loaderpath + "filesystem.js")
require(loaderpath + "config.js")
require(loaderpath + "object.js")
require(loaderpath + "module.js")
require(loaderpath + "rootmodule.js")
require(loaderpath + "requiremodule.js")

require(loaderpath + "system.js")
require(loaderpath + "world.js")
require(loaderpath + "god.js")
require(loaderpath + "ruleengine.js")


/** 
Project setup


**/


/** doc
# The Sactide Framework Module Loading System

The Sactide framework employs a unique and powerful approach to module loading, designed to efficiently handle both server and client-side code in a monolithic structure. This system is built on the principle of centralized module management through strategically placed _root.js files.

## Key Concepts:

1. Monolithic Approach: The framework assumes that server and client often share code, allowing for a unified codebase structure.
2. Rule-Based Loading: Modules are loaded based on requirements and rules, which are determined by configuration role settings.
3. Folder-Based Organization: Scripts are organized in folders, with each folder containing a _root.js file that describes the contents and structure of that location.

## _root.js File Structure:

The _root.js file is a JavaScript module that serves as a manifest for its containing folder. It begins with a call to _.ambient.rootmodule(foldername), which creates a rootmodule object. Importantly, foldernames always include a trailing slash.

The rootmodule object provides two primary methods:

- include(modulename, rule): Used to include modules within the current folder.
- require(fullpath, rule): Used to specify dependencies from other locations.
- addrole(role, rule)

## Rules and Roles:

Rules are defined as strings and can be combined using logical operators. For example:

- "server"
- "server && !node"
- "client"

Special roles include:

server: Activated when the loader detects server-side execution.
client: Activated when the loader detects client-side execution.
require: Used when a module is explicitly required.

Custom roles can be defined in the server configuration or dynamically added using the addrole() method.


## Centralized Requirement Definition:

Unlike traditional module loaders, Sactide defines requirements within the _root.js file. When a module is required, the system loads not only the specified module but also any included files in nested _root.js files.

This approach offers several advantages:

1. Clearer dependency management
2. Easier code sharing between server and client
3. More flexible and context-aware module loading
4. Simplified project structure through centralized configuration

The Sactide framework's module loading system provides a robust and flexible solution for managing complex web applications with shared server and client code. By centralizing module definitions and using rule-based loading, it offers developers a powerful tool for creating efficient and maintainable projects.

Sample root file
```
_.ambient.rootmodule("base/")
    .include("base")
    .require("sourcery/core/base/base")
    .include("basicstring")
    .include("basicpath")
    .include("basicmath")
    .include("basicdate")
    .include("basicarray", "require")
    .include("basicjson")
    .addrole("development", "server && !production")
 ```
 **/



//require(loaderpath + "loader.js")



//require(loaderpath + "oophelper.js")
//require(_.config.loaderpath + "config.js")

//require(_.config.loaderpath + "loader.js")
