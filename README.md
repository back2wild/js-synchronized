# js-synchronized

```
npm install --save js-synchronized
```

Sometimes the Promise act like multiple thread. For several lines of code in a function,
when one call already waiting on a Promise been fulfilled, another call may come in,
just like "concurrent" in mutiple thread.
Which make the lies of code a "critical section".

There is critical section, there is synchronization. This lib is trying to solve these problems.

**[Full Documentation](https://back2wild.github.io/js-synchronized)**

> "*concurrent calls*" in the following context actullay means another call on a method
started without waiting for the previous call returned Promise fulfilled

## synchronized

Make target instance method execute sequentially on "concurrent calls".
It actually make every call on async method wait until the previously returned Promise fulfilled.

**Example**

```typescript
class SomeClass {

  @synchronized()
  public async f1(wait: number) {
    await new Promise((resolve: any) => {
      setTimeout(resolve, wait);
    });
    console.log('f1-' + wait);
    return wait;
  }

}

const obj = new SomeClass();
obj.f1(3000);
obj.f1(2000);
obj.f1(1000);
```

The `f1()` will execute sequentially, so event the `obj1.f1(3000)` fulfilled take longer
than `obj1.f1(1000)`, the 1000 have to wait 3000 finish first.

## takeLatest

Make all "concurrent calls" on target intance method return the value of
the most latest call, all results of previous calls are abandoned.

## takeLeading

Make all "concurrent calls" on target intance method return the value of
the most leading call, all results of afterwards calls are abandoned.
