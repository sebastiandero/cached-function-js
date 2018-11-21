/**
 MIT License

 Copyright (c) 2018 Sebastian-Paul De Ro

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {HashStrategy, XXHashStrategy} from "./hash"
import {DefaultValueMappingStrategy, ValueMappingStrategy} from "./value-mapping"

interface CachedFunctionOptions {
    hashingStrategy?: HashStrategy;
    valueMappingStrategy?: ValueMappingStrategy;
}

const defaultOptions: CachedFunctionOptions = {
    hashingStrategy: new XXHashStrategy(),
    valueMappingStrategy: new DefaultValueMappingStrategy()
}

/**
 * creates a function that is cache enabled and caches each input parameter set to a return value.
 * this should only be used on functions that behave like mathematical functions in that they have only one possible return for each parameter set
 *
 * the returned value from the inner function is, if the return type is an object always a reference to the object in cache
 *
 * uses xxhash hashing for the cache
 *
 * @param f the function in the form of an arrow function (<args>) => {<logic + return>}
 * @param options an object of type CachedFunctionOptions
 */
export function cachedFunction<T, S>(f, options: CachedFunctionOptions = {}): any {
    const cache = {};
    options = {...defaultOptions, ...options}
    return function (...args): T {
        if (!options.hashingStrategy) {
            throw 'supplied invalid hashing strategy to cachedFunction'
        }
        const key = options.hashingStrategy.hashString(objectToString(args, options));

        if (cache.hasOwnProperty(key)) {
            return cache[key];
        }

        let result
        // @ts-ignore
        if (this) {
            // @ts-ignore
            result = f.apply(this, args)
        } else {
            result = f(...args);
        }

        cache[key] = result;
        return result
    };
}

/**
 * this is a typescript decorator!! with support for "this"
 *
 * creates a function that is cache enabled and caches each input parameter set to a return value.
 * this should only be used on functions that behave like mathematical functions in that they have only one possible return for each parameter set
 *
 * the returned value from the inner function is, if the return type is an object always a reference to the object in cache
 *
 * uses simple bitwise hashing
 */
export function Cached(options?: CachedFunctionOptions) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let f = descriptor.value
        // @ts-ignore
        let cachedF = cachedFunction(f, options)
        descriptor.value = function (...args) {
            return cachedF.apply(this, args)
        };
        return descriptor
    }
}

function objectToString(object: any, options: CachedFunctionOptions, allObjects?: any[], path?: string): string {
    let stringRepresentation = "";
    if (!allObjects) {
        allObjects = [];
        allObjects.push(object);
    }
    if (!path) {
        path = "_[param]"
    }

    if (object != null) {
        for (const key of Object.getOwnPropertyNames(object)) {
            if (!options.valueMappingStrategy) {
                throw 'supplied invalid value mapping strategy to cachedFunction'
            }
            const value = options.valueMappingStrategy.map(object[key]);
            if (typeof(value) === 'object' && !allObjects.some(value1 => value1 === value)) {
                let newPath = `${path}_${key}`
                allObjects.push(value);
                stringRepresentation += objectToString(value, options, allObjects, newPath);
            } else if (isPrimitiveNonNull(value)) {
                stringRepresentation += `${path}_[${typeof(value)}]${key}: ${value}`;
            }
        }
    }
    return stringRepresentation;
}

function isPrimitiveNonNull(value: any) {
    return typeof(value) === 'string' || typeof(value) === 'number' || typeof(value) === 'boolean';
}