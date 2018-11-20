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
import {Cached, cachedFunction} from "./main"
import {XXHashStrategy} from "./hash"


test('should cache without parameter', () => {
    let mock = jest.fn(() => "abc")
    let fun = cachedFunction(mock)

    fun()
    fun()

    expect(fun()).toBe("abc");
    expect(mock.mock.calls.length).toBe(1);
});

test('should cache with two primitive parameters', () => {
    let mock = jest.fn((a: number, b: string) => a.toString() + b)
    let fun = cachedFunction(mock)

    fun(1, "a")
    fun(1, "a")
    fun(2, "a")

    expect(fun(1, "a")).toBe("1a");
    expect(mock.mock.calls.length).toBe(2);
});

test('should cache with primitives inside object', () => {
    let mock = jest.fn((value: { a: number, b: string }) => value.a.toString() + value.b)
    let fun = cachedFunction(mock)

    fun({a: 1, b: "a"})
    fun({a: 1, b: "a"})
    fun({a: 1, b: "b"})

    expect(fun({a: 1, b: "a"})).toBe("1a");
    expect(mock.mock.calls.length).toBe(2);
});

test('should cache with nested object', () => {
    let mock = jest.fn((value: { a: { number: number }, b: string }) => value.a.number.toString() + value.b)
    let fun = cachedFunction(mock)

    fun({a: {number: 5}, b: "a"})
    fun({a: {number: 2}, b: "a"})
    fun({a: {number: 1}, b: "a"})

    expect(fun({a: {number: 5}, b: "a"})).toBe("5a");
    expect(mock.mock.calls.length).toBe(3);
});

test('should cache with array', () => {
    let mock = jest.fn((value: number[]) => value.reduce((previousValue, currentValue) => previousValue ** currentValue))
    let fun = cachedFunction(mock)

    fun([2, 3])
    fun([3, 2])
    fun([2, 3])

    expect(fun([2, 3])).toBe(8);
    expect(mock.mock.calls.length).toBe(2);
});

test('should cache symbol values', () => {
    // @ts-ignore
    let mock = jest.fn((a: symbol, b: symbol) => Symbol.keyFor(a) + Symbol.keyFor(b))
    let fun = cachedFunction(mock)

    fun(Symbol.for("a"), Symbol.for("b"))
    fun(Symbol.for("a"), Symbol.for("b"))
    fun(Symbol.for("b"), Symbol.for("b"))

    expect(fun(Symbol.for("a"), Symbol.for("b"))).toBe("ab");
    expect(mock.mock.calls.length).toBe(2);
});

test('should cache with options', () => {
    let mock = jest.fn((a: number, b: string) => a.toString() + b)
    let fun = cachedFunction(mock, {hashingStrategy: new XXHashStrategy()})

    fun(1, "a")
    fun(1, "a")
    fun(2, "a")

    expect(fun(1, "a")).toBe("1a");
    expect(mock.mock.calls.length).toBe(2);
});

test('should use decorator', () => {

    class Abc {
        @Cached()
        myFun(a: number, b: string) {
            return a.toString() + b
        }
    }

    let a = new Abc();

    expect(a.myFun(1, "a")).toBe("1a");
});

test('should support this in decorator function', () => {

    class Abc {
        aVal = 2

        @Cached()
        myFun(a: number, b: string) {
            return a.toString() + b + this.aVal.toString()
        }
    }

    let a = new Abc();

    expect(a.myFun(1, "a")).toBe("1a2");
});
