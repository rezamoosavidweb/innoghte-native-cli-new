import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';

import { Button } from '@/ui/components/Button';
import { InputField } from '@/ui/components/form/InputField';
import { useCountdown, formatCountdown } from '@/ui/hooks/useCountdown';
import { useThemeColors } from '@/ui/theme';

import { createOtpVerificationStyles } from './OtpVerification.styles';

export type OtpVerificationProps = {
  /** Current OTP code (controlled by the flow). */
  code: string;
  onChangeCode: (code: string) => void;
  /** Verify the entered code. */
  onSubmit: () => void;
  submitLabel: string;
  submitting?: boolean;
  /** Flow-level error (invalid code, network, etc.). */
  error?: string | null;
  /** Re-request a code; the internal resend countdown restarts automatically. */
  onResend: () => void;
  resending?: boolean;
  /** Resend cooldown in seconds (web uses 2 minutes). */
  resendSeconds?: number;
  notReceivedLabel: string;
  resendLabel: string;
  resendInLabel: string;
  codeAccessibilityLabel: string;
  codePlaceholder?: string;
  title?: string;
  subtitle?: string;
  /** Auto-submit once the code reaches this length (SMS autofill UX). Omit to disable. */
  autoSubmitLength?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared OTP verification UI for every code-entry flow (register, contact).
 * The flow supplies the code state, verify/resend callbacks, and copy; this
 * component owns the input (SMS one-time-code autofill, LTR, RTL-aware labels),
 * the resend countdown, loading/error states, and the submit button — all on
 * theme tokens. API contracts stay in each flow's own layer.
 */
export const OtpVerification = React.memo(function OtpVerification({
  code,
  onChangeCode,
  onSubmit,
  submitLabel,
  submitting = false,
  error,
  onResend,
  resending = false,
  resendSeconds = 120,
  notReceivedLabel,
  resendLabel,
  resendInLabel,
  codeAccessibilityLabel,
  codePlaceholder,
  title,
  subtitle,
  autoSubmitLength,
  style,
}: OtpVerificationProps) {
  const colors = useThemeColors();
  const s = React.useMemo(() => createOtpVerificationStyles(colors), [colors]);
  const { remaining, reset, expired } = useCountdown(resendSeconds);

  const trimmed = code.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  // Auto-submit once when an autofilled code reaches the expected length.
  const autoSubmittedRef = React.useRef(false);
  React.useEffect(() => {
    if (!autoSubmitLength) return;
    if (trimmed.length !== autoSubmitLength) {
      autoSubmittedRef.current = false;
      return;
    }
    if (!submitting && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      onSubmit();
    }
  }, [trimmed, autoSubmitLength, submitting, onSubmit]);

  const handleResend = React.useCallback(() => {
    onResend();
    reset();
  }, [onResend, reset]);

  return (
    <View style={[s.wrap, style]}>
      {title ? <Text style={s.title}>{title}</Text> : null}
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}

      <InputField
        accessibilityLabel={codeAccessibilityLabel}
        placeholder={codePlaceholder ?? ''}
        keyboardType="number-pad"
        oneTimeCode
        forceInputLtr
        autoFocus
        value={code}
        onChangeText={onChangeCode}
        error={error ?? undefined}
      />

      <View style={s.resendRow}>
        <Text style={s.resendText}>{notReceivedLabel}</Text>
        {expired ? (
          <Button
            layout="auto"
            variant="text"
            title={resendLabel}
            onPress={handleResend}
            loading={resending}
            disabled={resending}
            contentStyle={{ width: '100%' }}
          >
            <Text style={s.resendLink}>{resendLabel}</Text>
          </Button>
        ) : (
          <Text style={s.resendTimer}>
            {resendInLabel} {formatCountdown(remaining)}
          </Text>
        )}
      </View>

      <Button
        variant="filled"
        title={submitLabel}
        onPress={onSubmit}
        loading={submitting}
        disabled={!canSubmit}
      />
    </View>
  );
});

OtpVerification.displayName = 'OtpVerification';
