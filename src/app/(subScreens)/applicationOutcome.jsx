

import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { postRequest } from '../../api/postRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

const GREEN = '#16A34A';

const validateDate = (value) => {
  const trimmed = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error('Please enter a valid date in YYYY-MM-DD format.');
  }

  const [year, month, day] = trimmed.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error('Please enter a valid calendar date.');
  }

  return trimmed;
};

export default function RecordOutcome() {
  const { id } = useLocalSearchParams();
  const [outcomeType, setOutcomeType] = useState('Unknown');
  const [outcomeDate, setOutcomeDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onPrimaryAction: null,
  });

  const options = [
    'Offer Received',
    'Accepted',
    'Declined',
    'Rejected',
    'Withdrawn',
    'No Response',
    'Position Filled',
    'Unknown',
  ];

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const save = async () => {
    if (!outcomeDate) {
      setModal({
        visible: true,
        title: 'Date required',
        message: 'Enter the date of the outcome.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
      return;
    }

    setSaving(true);
    try {
      const formattedDate = validateDate(outcomeDate);

      await postRequest(`/applications/${id}/outcome`, {
        outcomeType: outcomeType.toUpperCase().replaceAll(' ', '_'),
        outcomeDate: formattedDate,
        outcomeNotes: notes,
      });

      setModal({
        visible: true,
        title: 'Outcome saved',
        message: 'Your application outcome has been recorded.',
        type: 'info',
        onPrimaryAction: () => {
          closeModal();
          router.replace({
            pathname: '/(subScreens)/applicationDetails',
            params: { id },
          });
        },
      });
    } catch (e) {
      setModal({
        visible: true,
        title: 'Could not save outcome',
        message:
          e?.data?.message ||
          e.message ||
          'Please check the backend request format.',
        type: 'error',
        onPrimaryAction: closeModal,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomSafeArea>
      <View style={s.top}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={23} />
        </TouchableOpacity>
        <Text style={s.title}>Record outcome</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView>
        <Text style={s.label}>What happened?</Text>
        {options.map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setOutcomeType(v)}
            style={[s.option, outcomeType === v && s.selected]}
          >
            <Text style={[s.optionText, outcomeType === v && s.selectedText]}>
              {v}
            </Text>
            {outcomeType === v ? (
              <Feather name="check-circle" color={GREEN} />
            ) : null}
          </TouchableOpacity>
        ))}

        <Text style={s.label}>Outcome date *</Text>
        <TextInput
          value={outcomeDate}
          onChangeText={setOutcomeDate}
          style={s.input}
          placeholder="YYYY-MM-DD"
        />

        <Text style={s.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={[s.input, { height: 90, textAlignVertical: 'top' }]}
          multiline
          placeholder="Optional"
        />

        <TouchableOpacity style={s.submit} onPress={save} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.submitText}>Save outcome</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <CustomModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
        onPrimaryAction={modal.onPrimaryAction}
      />
    </CustomSafeArea>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontFamily: 'semiBold' },
  label: {
    fontSize: 13,
    fontFamily: 'semiBold',
    marginTop: 15,
    marginBottom: 8,
    color: '#111827',
  },
  option: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 9,
    padding: 13,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selected: { borderColor: GREEN, backgroundColor: '#F0FDF4' },
  optionText: { fontSize: 13, color: '#374151' },
  selectedText: { color: GREEN, fontFamily: 'semiBold' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 9,
    padding: 12,
    fontSize: 13,
  },
  submit: {
    backgroundColor: GREEN,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 35,
  },
  submitText: { color: '#fff', fontFamily: 'semiBold' },
});