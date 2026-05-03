/**
 * Lightweight phone field: national `dial` + structured country metadata.
 * See package README in source: use `Controller` with `value` / `onChange` / `error` / `touched`.
 * Default `defaultCountryIso` follows `REACT_NATIVE_IS_DOT_IR` (ir vs us) when unset.
 * Extend `PHONE_COUNTRIES` in `phoneCountries.ts` for more regions.
 */
export {
  PhoneInput,
  defaultPhoneInputValue,
  type PhoneInputProps,
  type PhoneInputValue,
} from './PhoneInput';
export {
  PHONE_COUNTRIES,
  countryFlagEmoji,
  formatDialCode,
  getCountryByIso,
  type PhoneCountry,
} from './phoneCountries';
