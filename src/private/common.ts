import { AbandonedCallAction } from '../types';

export function takesAddWaiting(
  inst: any, promResolversKey: string, promRejectorsKey: string,
  resolve: any, reject: any)
{
  if (!inst[promResolversKey]) {
    inst[promResolversKey] = [];
  }
  if (!inst[promRejectorsKey]) {
    inst[promRejectorsKey] = [];
  }
  inst[promResolversKey].push(resolve);
  inst[promRejectorsKey].push(reject);
}

export function takesFlush(
  mode: 'leading' | 'latest',
  inst: any, promResolversKey: string, promRejectorsKey: string,
  type: 'resolve' | 'reject', value: any,
  acAction: AbandonedCallAction, acActionParam?: any
) {
  const len = inst[promResolversKey].length;
  if (type === 'resolve') {
    inst[promResolversKey].forEach((resolve: any, index: number) => {
      if (mode === 'latest' && index === len - 1) {
        resolve(value);
        return;
      } else if (mode === 'leading' && index === 0) {
        resolve(value);
      }
      if (acAction === AbandonedCallAction.StayUnfulfilled) {
      } else if (acAction === AbandonedCallAction.AlwaysResolve) {
        resolve(acActionParam);
      } else if (acAction === AbandonedCallAction.AlwaysReject) {
        const reject = inst[promRejectorsKey][index];
        reject(acActionParam);
      } else {
        resolve(value);
      }
    });
  } else if (type === 'reject') {
    inst[promRejectorsKey].forEach((reject: any, index: number) => {
      if (mode === 'latest' && index === len - 1) {
        reject(value);
        return;
      } else if (mode === 'leading' && index === 0) {
        reject(value);
      }
      if (acAction === AbandonedCallAction.StayUnfulfilled) {
      } else if (acAction === AbandonedCallAction.AlwaysResolve) {
        const resolve = inst[promResolversKey][index];
        resolve(acActionParam);
      } else if (acAction === AbandonedCallAction.AlwaysReject) {
        reject(acActionParam);
      } else {
        reject(value);
      }
    });
  }
  inst[promResolversKey] = null;
  inst[promRejectorsKey] = null;
}
