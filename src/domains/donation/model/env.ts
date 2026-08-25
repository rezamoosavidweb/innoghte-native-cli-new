export function resolveShowZarinpal(): boolean {
  // Direct access is required for babel-plugin-transform-inline-environment-variables.
  return process.env.REACT_NATIVE_IS_SHOW_ZARINPAL === 'true';
}

export function resolveShowVandar(): boolean {
  return process.env.REACT_NATIVE_IS_SHOW_VANDAR === 'true';
}
