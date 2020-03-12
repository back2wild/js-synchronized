/**
 * For those abandoned calls, how to handle their returned promise
 */
export enum AbandonedCallAction {
  /**
   * do nothing, the returned promises have the same fulfilled result with the normal
   */
  None = 0,

  /**
   * make the abandoned promises stay unfulfilled
   */
  StayUnfulfilled = 10,

  /**
   * make the abandoned promises always resolve, you can specify a parameter
   */
  AlwaysResolve = 21,

  /**
   * make the abandoned promises always reject, you can specify a parameter
   */
  AlwaysReject = 22,
}
