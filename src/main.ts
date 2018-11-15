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

/**
 * creates a function that is cache enabled and caches each input parameter set to a return value.
 * this should only be used on functions that behave like mathematical functions in that they have only one possible return for each parameter set
 *
 * the returned value from the inner function is, if the return type is an object always a reference to the object in cache
 *
 * uses simple bitwise hashing
 *
 * @param f the function in the form of an arrow function (<args>) => {<logic + return>}
 */
export function cachedFunction<T>(f: (...args: any[]) => T): (...args: any[]) => T {
    const cache = {};
    return (...args): T => {
        return getCacheOrRunFunction(cache, args, f);
    };
}

/**
 * creates a function that is cache enabled and caches each input parameter set to a return value.
 * this should only be used on functions that behave like mathematical functions in that they have only one possible return for each parameter set
 *
 * the returned value from the inner function is, if the return type is an object is cloned using object.assign
 *
 * uses simple bitwise hashing
 *
 * @param f the function in the form of an arrow function (<args>) => {<logic + return>}
 */
export function cachedFunctionDeepCopy<T>(f: (...args: any[]) => T): (...args: any[]) => T {
    const cache = {};
    return (...args): T => {
        const result = getCacheOrRunFunction(cache, args, f);
        if (typeof(result) === 'object') {
            return Object.assign({}, result);
        } else {
            return result;
        }
    };
}

function getCacheOrRunFunction<T>(cache: any, args: any[], f: (...args: any[]) => T): T {
    const key = hashObject(args);

    if (cache.hasOwnProperty(key)) {
        return cache[key];
    }

    const result = f(...args);
    cache[key] = result;
    return result;
}

/* tslint:disable:no-bitwise */
function hashPrimitiveAsString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const character = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function hashObject(object: any): number {
    let hash = 0;
    for (const property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof(property) === 'object' && property !== object) {
                hash += hashObject(object);
            } else if (typeof(property) !== 'function') {
                hash += hashPrimitiveAsString(property);
            }
        }
    }
    return hash;
}
