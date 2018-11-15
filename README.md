# cached-functions-js

## how to use

Create a simple cached function following the "memoized function" pattern:
```javascript
import {cachedFunction} from 'cached-function-js'

const myFunc = cachedFunction((someObject, someNumber) => {
    return someVeryExpensiveComputation(someObject, someNumber)
})
```

Create a cached function that returns deep copies of the return values:

```javascript
import {cachedFunctionDeepCopy} from 'cached-function-js'

const myFunc = cachedFunctionDeepCopy((someObject, someNumber) => {
    return someVeryExpensiveComputation(someObject, someNumber)
})
```

Parameters are not necessary:

```javascript
import {cachedFunctionDeepCopy} from 'cached-function-js'

const myFunc = cachedFunctionDeepCopy(() => {
    return someVeryExpensiveComputation()
})
```

You can use this library to add member methods to classes or objects:

```javascript
import {cachedFunctionDeepCopy} from 'cached-function-js'

export class MyClass{
    myFunc = cachedFunctionDeepCopy(() => {
        return someVeryExpensiveComputation()
    })
}
```

```typescript
import {cachedFunctionDeepCopy} from 'cached-function-js'

export class MyClass{
    public myFunc = cachedFunctionDeepCopy(() => {
        return someVeryExpensiveComputation()
    })
}
```