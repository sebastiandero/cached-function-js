import {cachedFunction} from "./main"
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

