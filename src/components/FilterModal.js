import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { colors, radius } from '../constants/theme';
import Button from './Button';

const SORTS = [
  { value: 'default', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
];

const SORT_ICONS = {
  default: 'star-outline',
  price_asc: 'sort-ascending',
  price_desc: 'sort-descending',
  rating_desc: 'star-circle-outline',
};

const parse = (t) => {
  const n = parseFloat(t);
  return t.trim() !== '' && Number.isFinite(n) && n >= 0 ? n : null;
};

function FilterModal({ visible, sort, priceRange, onClose, onApply, onReset }) {
  const [draftSort, setDraftSort] = useState(sort);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setDraftSort(sort);
      setMin(priceRange.min === null ? '' : String(priceRange.min));
      setMax(priceRange.max === null ? '' : String(priceRange.max));
      setError('');
    }
  }, [visible, sort, priceRange]);

  const apply = () => {
    const lo = parse(min);
    const hi = parse(max);
    if (lo !== null && hi !== null && lo > hi) {
      setError('Minimum price cannot be greater than maximum price.');
      return;
    }
    onApply(draftSort, { min: lo, max: hi });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="tune-variant"
              size={responsiveFontSize(2.2)}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.heading}>Sort & Filter</Text>
            <Text style={styles.subheading}>Refine your results</Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            accessibilityLabel="Close filters"
          >
            <MaterialCommunityIcons
              name="close"
              size={responsiveFontSize(2.1)}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <Text style={styles.label}>Sort by</Text>
          </View>

          <View style={styles.sortList}>
            {SORTS.map((o) => {
              const active = draftSort === o.value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => setDraftSort(o.value)}
                  style={({ pressed }) => [
                    styles.sortRow,
                    active && styles.sortRowActive,
                    pressed && styles.sortRowPressed,
                  ]}
                >
                  <View style={[styles.sortIconWrap, active && styles.sortIconWrapActive]}>
                    <MaterialCommunityIcons
                      name={SORT_ICONS[o.value] ?? 'circle-outline'}
                      size={responsiveFontSize(1.9)}
                      color={active ? '#FFFFFF' : colors.primary}
                    />
                  </View>
                  <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>
                    {o.label}
                  </Text>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={styles.label}>Price range</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.inputShell}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                value={min}
                onChangeText={setMin}
                placeholder="Min"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.dash}>
              <View style={styles.dashLine} />
            </View>
            <View style={styles.inputShell}>
              <Text style={styles.currency}>$</Text>
              <TextInput
                value={max}
                onChangeText={setMax}
                placeholder="Max"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </View>

          {!!error && (
            <View style={styles.errorBanner}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={responsiveFontSize(1.7)}
                color={colors.danger}
              />
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            title="Reset"
            variant="outline"
            onPress={onReset}
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title="Apply"
            onPress={apply}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(3.5),
    borderTopLeftRadius: responsiveWidth(7),
    borderTopRightRadius: responsiveWidth(7),
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: responsiveWidth(10),
    height: responsiveHeight(0.55),
    borderRadius: responsiveHeight(0.3),
    backgroundColor: '#D9DEE7',
    marginBottom: responsiveHeight(1.6),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  headerIcon: {
    width: responsiveFontSize(4.2),
    height: responsiveFontSize(4.2),
    borderRadius: responsiveFontSize(1.4),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(3),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTextCol: {
    flex: 1,
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: responsiveFontSize(1.3),
    color: colors.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    width: responsiveFontSize(3.6),
    height: responsiveFontSize(3.6),
    borderRadius: responsiveFontSize(1.8),
    backgroundColor: '#F1F3F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: '#E2E5EB',
    transform: [{ scale: 0.92 }],
  },
  section: {
    marginBottom: responsiveHeight(1.6),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  stepBadge: {
    width: responsiveFontSize(2.2),
    height: responsiveFontSize(2.2),
    borderRadius: responsiveFontSize(1.1),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(2),
  },
  stepText: {
    fontSize: responsiveFontSize(1.2),
    fontWeight: '800',
    color: '#FFFFFF',
  },
  label: {
    fontSize: responsiveFontSize(1.55),
    fontWeight: '700',
    color: colors.text,
  },
  sortList: {
    gap: responsiveHeight(0.9),
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortRowActive: {
    backgroundColor: '#EEF2FF',
    borderColor: colors.primary,
  },
  sortRowPressed: {
    opacity: 0.85,
  },
  sortIconWrap: {
    width: responsiveFontSize(3.4),
    height: responsiveFontSize(3.4),
    borderRadius: responsiveFontSize(1.1),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(3),
  },
  sortIconWrapActive: {
    backgroundColor: colors.primary,
  },
  sortLabel: {
    flex: 1,
    fontSize: responsiveFontSize(1.5),
    fontWeight: '600',
    color: colors.text,
  },
  sortLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  radio: {
    width: responsiveFontSize(2.2),
    height: responsiveFontSize(2.2),
    borderRadius: responsiveFontSize(1.1),
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: responsiveFontSize(1.1),
    height: responsiveFontSize(1.1),
    borderRadius: responsiveFontSize(0.55),
    backgroundColor: colors.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(3.5),
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFC',
  },
  currency: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: '700',
    color: colors.primary,
    marginRight: responsiveWidth(1.5),
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontSize: responsiveFontSize(1.55),
    color: colors.text,
  },
  dash: {
    paddingHorizontal: responsiveWidth(2.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashLine: {
    width: responsiveWidth(4),
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: responsiveHeight(1.2),
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: radius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  error: {
    flex: 1,
    color: colors.danger,
    fontSize: responsiveFontSize(1.3),
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2.5),
  },
});

export default React.memo(FilterModal);