import * as React from 'react';
import { useMemo } from 'react';
import type { TextInput } from 'react-native';

export const donationAmountOptions = {
  ir: {
    defaultAmount: '200000',
    presets: ['200000', '400000'],
  },
  com: {
    defaultAmount: '5',
    presets: ['5', '25'],
  },
} as const;

export function useDonationAmountState(isDotIr: boolean) {
  const options = isDotIr
    ? donationAmountOptions.ir
    : donationAmountOptions.com;
  const [activeButton, setActiveButton] = React.useState<string>(
    options.defaultAmount,
  );
  const [amount, setAmount] = React.useState<string>(options.defaultAmount);
  const [isCustomAmount, setIsCustomAmount] = React.useState(false);
  const amountRef = React.useRef<TextInput>(null);

  const resetAmountAfterGatewayVerify = React.useCallback(() => {
    setAmount(options.defaultAmount);
    setActiveButton(options.defaultAmount);
    setIsCustomAmount(false);
  }, [options.defaultAmount]);

  const handlePresetAmount = React.useCallback((value: string) => {
    setAmount(value);
    setActiveButton(value);
    setIsCustomAmount(false);
  }, []);

  const handleCustomPress = React.useCallback(() => {
    setIsCustomAmount(true);
    setActiveButton('');
    requestAnimationFrame(() => amountRef.current?.focus());
  }, []);

  const onAmountChangeText = React.useCallback((v: string) => {
    // Strip thousands separators (and any non-numeric) so `amount` stays raw
    // for the API; editing a value turns it into a custom (non-preset) amount.
    const raw = v.replace(/[^\d.]/g, '');
    setAmount(raw);
    setActiveButton('');
    setIsCustomAmount(true);
  }, []);

  const preset = useMemo(
    () => ({
      isIrPreset200: isDotIr && activeButton === '200000' && !isCustomAmount,
      isIrPreset400: isDotIr && activeButton === '400000' && !isCustomAmount,
      isComPreset5: !isDotIr && activeButton === '5' && !isCustomAmount,
      isComPreset25: !isDotIr && activeButton === '25' && !isCustomAmount,
    }),
    [activeButton, isCustomAmount, isDotIr],
  );

  return {
    amount,
    activeButton,
    isCustomAmount,
    amountRef,
    preset,
    resetAmountAfterGatewayVerify,
    handlePresetAmount,
    handleCustomPress,
    onAmountChangeText,
  };
}
