import type { VerifyStep } from '@/shared/contracts/verification';

export type VerifyScreenState = {
  step: VerifyStep;
  contactValue: string;
  codeValue: string;
  isSending: boolean;
  isVerifying: boolean;
  errorMessage: string | null;
};

export const verifyInitialState: VerifyScreenState = {
  step: 'INPUT',
  contactValue: '',
  codeValue: '',
  isSending: false,
  isVerifying: false,
  errorMessage: null,
};

export type VerifyScreenAction =
  | { type: 'contact_changed'; value: string }
  | { type: 'code_changed'; value: string }
  | { type: 'send_started' }
  | { type: 'send_succeeded' }
  | { type: 'send_failed'; message: string }
  | { type: 'verify_started' }
  | { type: 'verify_succeeded' }
  | { type: 'verify_failed'; message: string }
  | { type: 'reset_error' };

export function verifyScreenReducer(
  state: VerifyScreenState,
  action: VerifyScreenAction,
): VerifyScreenState {
  switch (action.type) {
    case 'contact_changed':
      return {
        ...state,
        contactValue: action.value,
        errorMessage: null,
      };
    case 'code_changed':
      return {
        ...state,
        codeValue: action.value,
        errorMessage: null,
      };
    case 'reset_error':
      return { ...state, errorMessage: null };
    case 'send_started':
      return {
        ...state,
        isSending: true,
        errorMessage: null,
      };
    case 'send_succeeded':
      return {
        ...state,
        isSending: false,
        step: 'CODE',
        errorMessage: null,
      };
    case 'send_failed':
      return {
        ...state,
        isSending: false,
        errorMessage: action.message,
      };
    case 'verify_started':
      return {
        ...state,
        isVerifying: true,
        errorMessage: null,
      };
    case 'verify_succeeded':
      return {
        ...state,
        isVerifying: false,
        errorMessage: null,
      };
    case 'verify_failed':
      return {
        ...state,
        isVerifying: false,
        errorMessage: action.message,
      };
  }
}
