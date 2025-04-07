declare global {
    var _: {
        ambient: {
            module(name: string, source: (_: globalspace) => void): coremodule;
        }
    };
}

declare class coreobject {
    modelname(): string;
}

declare class coremodule extends coreobject {
    source(_: (_: globalspace) => void): this;
    onload(_: (_: globalspace) => void): this;
}


interface globalspace {
    enum: {
        enum(name: string, items: string[], offset?: number);
        binnum(name: string, items: string[], offset?: number);
    }

    helper: {

    }

    make: {
        object(): _object;
    }

    crlf: string;
    lf: string;
    cr: string;    

    uniqueid(): number;

    isstring(value: any): boolean;
    isnumber(value: any): boolean;
    isdate(value: any): boolean;
    isarray(value: any): boolean;
    isfunction(value: any): boolean;
    isjson(value: any): boolean;
    ismodel(value: any): boolean;
    isarraybuffer(value: any): boolean;
    isregex(value: any): boolean;
    iselement(value: any): boolean;
    isempty(value: any): boolean;
    isemptyobject(obj: any): boolean;
    isodd(value: number): boolean;
    iseven(value: any): boolean;
    iserror(value: any): boolean;
    isnumeric(value: any): boolean; 

    normalize(value: any, context?: any): any;
    cint(value: any): number;
    cstr(value: any): string;
    tostring(value: any): string;
    length(value: any): number;
    cbool(value: any): boolean;
    arg2array(args: IArguments): any[];    

    foreach(items: any, fn: function(item, index), context: any): void;
    rofeach(items: any, fn: function(item, index), context: any): void;    

    memoize(fn: function): function;

    vtnull: number;
    vtstring: number;
    vtboolean: number;
    vtnumber: number;
    vtdate: number;
    vtregex: number;
    vtfunction: number;
    vtarray: number;
    vtjson: number;
    vtblob: number;
    vtmodel: number;

    vartype(value: any): number | undefined;
    typename(value: any): string;

    var: {
        createempty(vartype: number): any;
        deepcompare(value1: any, value2: any): boolean;
    };     
}

export { };
