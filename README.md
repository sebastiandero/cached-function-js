# cached-functions-js

## Summary

This library caches and maps your parameters to a return value.

It does this by hashing your parameters.

It has **typescript** typings!!

The hashing function used is **xxhash**.

## how to use

create a cached member method in typescript(the object in the decorator is optional):
```typescript
import {Cached} from 'cached-function-js'
class Abc {
        aVal = 2

        @Cached({hashingStrategy: new MyOwnHashingStrat(), valueMappingStrategy: new MyOwnMapper()})
        myFun(a: number, b: string) {
            return a.toString() + b + this.aVal.toString()
        }
    }
```

Create a simple cached function following the "memoized function" pattern:
```javascript
import {cachedFunction} from 'cached-function-js'

const myFunc = cachedFunction((someObject, someNumber) => {
    return someVeryExpensiveComputation(someObject, someNumber)
})
```

Parameters are not necessary:

```javascript
import {cachedFunction} from 'cached-function-js'

const myFunc = cachedFunction(() => {
    return someVeryExpensiveComputation()
})
```

You can use this library to add member methods to classes or objects:

```javascript
import {cachedFunction} from 'cached-function-js'

export class MyClass{
    myFunc = cachedFunction(() => {
        return someVeryExpensiveComputation()
    })
}
```

```typescript
import {cachedFunction} from 'cached-function-js'

export class MyClass{
    public myFunc = cachedFunction(() => {
        return someVeryExpensiveComputation()
    })
}
```

You can provide your own strategies in the options object, all of them are optional though.

If you write your own (and use typescript) please use the _ValueMappingStrategy_, _HashStrategy_ interfaces 
for your own convenience.

```typescript
import {cachedFunction} from 'cached-function-js'

const myFunc = cachedFunction((someObject: any, someNumber: any) => {
    return someVeryExpensiveComputation(someObject, someNumber)
}, {hashingStrategy: new MyOwnHashingStrat(), valueMappingStrategy: new MyOwnMapper()})
```

## Changelog

### [2.0.0] - 2015-12-03
#### Added
 - Support for UMD, ES6 and CommonJS(CJS) modules using RollupJS
 - Now supports browsers because of UMD support
#### Removed
 - Symbols as they are supported from es6 onward
#### Changed
 - changed target from es6 to es5