/**
 * Use direct `process.env.KEY` so `babel-plugin-transform-inline-environment-variables`
 * can replace it at bundle time (assigning `process.env` to a variable breaks inlining).
 */
export const isDotIr = process.env.REACT_NATIVE_IS_DOT_IR === 'ir';

export const scopeHeader = isDotIr ? 'ir' : 'com';
