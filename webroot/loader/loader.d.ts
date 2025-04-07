declare global {
    var _: {

        ambient: {
                module(name: string, source: (_: scripts) => void): module;

//             loader: {
                debug(line: string);                
                noop();                
                isfunction(value: any): boolean;
                isobject(value: any): boolean;
                cstr(value: any): string;
                normalize(value: any, context: object, arg: any);
                sameleft$(str1: string, str2: string): string;
                trim$(str: string): string;
                split$(str: string, delimiter: string, count: number): string[];
                foreach(items: [], next: (item, index) => void);
                extend(target: object, source: object): object;
                merge(target: object, source: object): object;

                file: {
                    loadfile(url: string, next: (error, content) => void);
                    loadscript(url: string, next: (error, content) => void);
                    isdir$(path: string): boolean;
                }
            
                module: module;
                rootmodule: rootmodule;
                ruleengine: ruleengine;

                define: {
                    object(name: string, model: function);
                    module(name: string, model: function);
                    rootmodule(name: string, model: function);
                    ruleengine(name: string, model: function);
                }

                make: {
                    object(): blobject;
                    module(parent, name: string, rule: string): module;
                    rootmodule(parent, name: string, rule: string): rootmodule;
                    ruleengine(): ruleengine;
                }
            };
//        };
    };
}

interface scripts {
    isalpha(value: any): boolean;
}

class _object {
    modelname(): string;
}

class module extends _object{
    parent(): rootmodule;
    path(): string;
    isrootmodule(): boolean;   
    require(path: string);
}

class rootmodule extends _object { 
    parent(): rootmodule;
    path(): string;
    isrootmodule(): boolean;   
    require(path: string);
    include(path: string, rule: string);
    updatestate(loadstate, done);
    loadfiles(url: string, next: function (error, content));
    loadscript(url: string, next: function(error, content));
}

class ruleengine extends _object{
    addrole(role);
    hasrole(role): boolean;
    delrole(role);
    checkrule(rule): boolean;
} 

export {};