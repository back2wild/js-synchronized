/**
 * A typescript decorator to make concurrent calls on target instance method execute sequentially
 *
 * @param group The identifier to group different methods.
 *              Methods in the same group are guaranteed to execute sequentially.
 *              This can be used to simulate a *read write lock*
 */
export function synchronized(group = '') {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValueFn = descriptor.value;
    const promKey = '__synchronized_p_' + (group || propertyKey);
    descriptor.value = function(...args: any[]) {
      const inst: any = this;

      let waitProm: Promise<any>;
      const existedProm = inst[promKey];
      if (existedProm) {
        waitProm = existedProm.then(() => {
          return originalValueFn.apply(inst, args);
        });
      } else {
        waitProm = originalValueFn.apply(inst, args);
      }
      inst[promKey] = waitProm;

      return waitProm.then((r) => {
        if (waitProm === inst[promKey]) {
          inst[promKey] = null;
        }
        return r;
      }).catch((err) => {
        if (waitProm === inst[promKey]) {
          inst[promKey] = null;
        }
        return Promise.reject(err);
      });
    };
  };
}
