import { AbandonedCallAction } from './types';
import { takesAddWaiting, takesFlush } from './private/common';

/**
 * A typescript decorator make all concurrent calls on target intance method return
 * the value of the most latest call, all results of previous calls are abandoned.
 *
 * @param acAction For those abandoned calls, how to handle their returned promise, see `AbandonedCallAction`
 * @param acActionParam only required when `acAction` is `AlwaysResolve` or `AlwaysReject`,
 *                      its the fulfilled result for corresponding promise
 */
export function takeLatest(acAction: AbandonedCallAction = AbandonedCallAction.None, acActionParam?: any) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalValueFn = descriptor.value;
    const promResolversKey = '__takeLatest_rs_' + propertyKey;
    const promRejectorsKey = '__takeLatest_rj_' + propertyKey;
    const invokeSeqKey = '__takeLatest_seq_' + propertyKey;

    descriptor.value = function(...args: any[]) {
      const inst: any = this;

      const oldSeq = inst[invokeSeqKey] || 0;
      const seqWhenInvoking = oldSeq + 1;
      inst[invokeSeqKey] = seqWhenInvoking;

      const prom = new Promise((resolve, reject) => {
        takesAddWaiting(
          inst, promResolversKey, promRejectorsKey,
          resolve, reject);
        originalValueFn.apply(inst, args).then((r: any) => {
          const currentSeq = inst[invokeSeqKey];
          if (currentSeq === seqWhenInvoking) {
            takesFlush('latest',
              inst, promResolversKey, promRejectorsKey,
              'resolve', r,
              acAction, acActionParam);
          }
        }).catch((err: any) => {
          const currentSeq = inst[invokeSeqKey];
          if (currentSeq !== seqWhenInvoking) {
            takesFlush('latest',
              inst, promResolversKey, promRejectorsKey,
              'reject', err,
              acAction, acActionParam);
          }
        });
      });
      return prom;
    };
  };
}
