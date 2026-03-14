import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = (SCREEN_WIDTH - 48) / 7;

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedDate,
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date(1990, 5, 1));
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(selectedDate || null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    const days: (number | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < minDate || date > maxDate;
  };

  const isDateSelected = (day: number) => {
    if (!tempSelectedDate) return false;
    return (
      tempSelectedDate.getDate() === day &&
      tempSelectedDate.getMonth() === currentMonth &&
      tempSelectedDate.getFullYear() === currentYear
    );
  };

  const handleDayPress = (day: number) => {
    if (isDateDisabled(day)) return;
    setTempSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const handleApply = () => {
    if (tempSelectedDate) {
      onSelect(tempSelectedDate);
    }
    onClose();
  };

  const handleClear = () => {
    setTempSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const formatSelectedDate = () => {
    if (!tempSelectedDate) return '';
    return `${MONTHS[tempSelectedDate.getMonth()]} ${tempSelectedDate.getDate()}, ${tempSelectedDate.getFullYear()}`;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.container}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Title */}
          <Text style={styles.title}>Select Date</Text>

          {/* Date Display Row */}
          <View style={styles.dateDisplayRow}>
            <Text style={styles.dateLabel}>Date of Birth</Text>
            {tempSelectedDate && (
              <View style={styles.dateChip}>
                <Text style={styles.dateChipText}>{formatSelectedDate()}</Text>
              </View>
            )}
          </View>

          {/* Month/Year Navigation */}
          <View style={styles.monthYearNav}>
            <TouchableOpacity onPress={goToPreviousMonth} style={styles.navArrow}>
              <Text style={styles.navArrowText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthYearText}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} style={styles.navArrow}>
              <Text style={styles.navArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map((day) => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {daysInMonth.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dayCell}
                onPress={() => day && handleDayPress(day)}
                disabled={!day || isDateDisabled(day)}
              >
                {day && (
                  <View style={[
                    styles.dayInner,
                    isDateSelected(day) && styles.dayInnerSelected,
                  ]}>
                    <Text
                      style={[
                        styles.dayText,
                        isDateSelected(day) && styles.dayTextSelected,
                        isDateDisabled(day) && styles.dayTextDisabled,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  dateDisplayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  dateLabel: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  dateChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  dateChipText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  monthYearNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  navArrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrowText: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '300',
  },
  monthYearText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dayHeader: {
    width: DAY_SIZE,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  dayHeaderText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xl,
  },
  dayCell: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayInnerSelected: {
    backgroundColor: COLORS.text,
  },
  dayText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  dayTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: COLORS.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  clearButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.text,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
});
