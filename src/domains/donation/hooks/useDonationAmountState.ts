import * as React from 'react';
import { useMemo } from 'react';
import type { TextInput } from 'react-native';

export function useDonationAmountState(isDotIr: boolean) {
  const [activeButton, setActiveButton] = React.useState(() =>
    isDotIr ? '50000' : '5',
  );
  const [amount, setAmount] = React.useState(() =>
    isDotIr ? '50000' : '5',
  );
  const [isCustomAmount, setIsCustomAmount] = React.useState(false);
  const amountRef = React.useRef<TextInput>(null);

  const resetAmountAfterGatewayVerify = React.useCallback(() => {
    setAmount(isDotIr ? '50000' : '5');
    setActiveButton(isDotIr ? '50000' : '5');
    setIsCustomAmount(false);
  }, [isDotIr]);

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
    setAmount(v);
    setActiveButton('');
  }, []);

  const preset = useMemo(
    () => ({
      isIrPreset50: isDotIr && activeButton === '50000' && !isCustomAmount,
      isIrPreset250: isDotIr && activeButton === '250000' && !isCustomAmount,
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
