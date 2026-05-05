import { useTheme } from '@react-navigation/native';
import { createPublicCourseDetailStyles } from './publicCourseDetail.styles';
import { View } from 'react-native';
import { Text } from '@/shared/ui/Text';
import Star2Icon from '@/assets/icons/star2.svg';

export interface OptionItemProps {
  label: string;
  value: string | number;
}

export const OptionItem = ({ label, value }: OptionItemProps) => {
  const { colors } = useTheme();
  const s = createPublicCourseDetailStyles(colors);

  return (
    <View style={s.optionItemContainer}>
      <View style={s.optionItemIconContainer}>
        <Star2Icon width={20} height={20} color="#fff" />
        <Text style={s.whiteText}>{label}</Text>
      </View>

      <Text style={s.primaryText}>{value}</Text>
    </View>
  );
};
