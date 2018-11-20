# cached-functions-js

## Summary

This library caches and maps your parameters to a return value.

It does this by hashing your parameters.

It has **typescript** typings!!

The hashing function used is **xxhash**.

## how to use

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