import { AbandonedCallAction } from './types';
import { takesAddWaiting, takesFlush } from './private/common';

/**
 * A typescript decorator make all concurrent calls on target intance method return
 * the value of the most leading call, all results of afterwards calls are abandoned.
 *
 *
 * @param acAction For those abandoned calls, how to handle their returned promise, see `AbandonedCallAction`
 * @param acActionParam only required when `acAction` is `AlwaysResolve` or `AlwaysReject`,
 *                      its the fulfilled result for corresponding promise
 */
export function takeLeading(acAction: AbandonedCallAction = AbandonedCallAction.None, acActionParam?: any) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValueFn = descriptor.value;
    const promResolversKey = '__takeLeading_rs_' + propertyKey;
    const promRejectorsKey = '__takeLeading_rj_' + propertyKey;

    descriptor.value = function(...args: any[]) {
      const inst: any = this;
      const isWaiting = !!inst[promResolversKey];
      const prom = new Promise((resolve, reject) => {
        takesAddWaiting(
          inst, promResolversKey, promRejectorsKey,
          resolve, reject);
        if (isWaiting) {
          return;
        }
        originalValueFn.apply(inst, args).then((r: any) => {
          takesFlush('leading',
              inst, promResolversKey, promRejectorsKey,
              'resolve', r,
              acAction, acActionParam);
        }).catch((err: any) => {
          takesFlush('leading',
              inst, promResolversKey, promRejectorsKey,
              'reject', err,
              acAction, acActionParam);

        });
      });
      return prom;
    };
  };
}
