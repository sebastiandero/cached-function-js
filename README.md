# cached-functions-js

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