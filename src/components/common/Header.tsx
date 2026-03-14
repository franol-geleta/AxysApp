import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../../constants/theme';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  rightComponent?: React.ReactNode;
  showProgress?: boolean;
  progress?: number;
}

export const Header: React.FC<HeaderProps> = memo(({
  title,
  onBack,
  onClose,
  rightComponent,
  showProgress = false,
  progress = 0,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
  const topPadding = Platform.OS === 'android' ? statusBarHeight : insets.top;

  return (
    <View style={[styles.wrapper, { paddingTop: topPadding }]}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.rightSection}>{rightComponent}</View>
      </View>

      {showProgress && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      )}
    </View>
  );
});

Header.displayName = 'Header';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 56,
  },
  leftSection: {
    width: 40,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backIcon: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
  },
  closeIcon: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.semiBold,
  },
  progressTrack: {
    height: 2,
    backgroundColor: COLORS.surface,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
