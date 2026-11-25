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

const toOptionalIsoDate = (value, label) => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return undefined;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    throw new Error(`${label} must be in YYYY-MM-DD format.`);
  }

  const [year, month, day] = trimmed.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`${label} is not a valid calendar date.`);
  }

  return parsed.toISOString();
};

export default function AddStage() {
  const { id } = useLocalSearchParams();
  const [type, setType] = useState('Assessment');
  const [status, setStatus] = useState('Planned');
  const [scheduledDate, setScheduledDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [assessmentArea, setAssessmentArea] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onPrimaryAction: null,
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const validScheduledDate = toOptionalIsoDate(
        scheduledDate,
        'Scheduled date'
      );
      const validCompletionDate = toOptionalIsoDate(
        completionDate,
        'Completion date'
      );

      await postRequest(`/applications/${id}/stages`, {
        stageType: type.toUpperCase().replaceAll(' ', '_'),
        status: status.toUpperCase(),
        scheduledDate: validScheduledDate,
        completionDate: validCompletionDate,
        assessmentArea: assessmentArea.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setModal({
        visible: true,
        title: 'Saved',
        message: 'Stage added to your application.',
        type: 'info',
        onPrimaryAction: () => {
          closeModal();
          router.back();
        },
      });
    } catch (e) {
      setModal({
        visible: true,
        title: 'Could not save stage',
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
        <Text style={s.title}>Add stage</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView>
        <Text style={s.label}>Stage type</Text>
        <View style={s.wrap}>
          {['Assessment', 'Interview', 'Final Stage', 'Other'].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setType(v)}
              style={[s.choice, type === v && s.on]}
            >
              <Text style={[s.ct, type === v && s.active]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Status</Text>
        <View style={s.wrap}>
          {['Planned', 'Completed', 'Skipped'].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setStatus(v)}
              style={[s.choice, status === v && s.on]}
            >
              <Text style={[s.ct, status === v && s.active]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {[
          ['Scheduled date (YYYY-MM-DD)', scheduledDate, setScheduledDate],
          ['Completion date (YYYY-MM-DD)', completionDate, setCompletionDate],
        ].map(([l, v, f]) => (
          <View key={l}>
            <Text style={s.label}>{l}</Text>
            <TextInput
              value={v}
              onChangeText={f}
              placeholder="Optional"
              style={s.input}
            />
          </View>
        ))}

        {type === 'Assessment' ? (
          <>
            <Text style={s.label}>Assessment area</Text>
            <TextInput
              value={assessmentArea}
              onChangeText={setAssessmentArea}
              placeholder="e.g. Numerical reasoning"
              style={s.input}
            />
          </>
        ) : null}

        <Text style={s.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          multiline
          style={[s.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Optional notes"
        />

        <TouchableOpacity style={s.submit} onPress={save} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.submitText}>Save stage</Text>
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
    marginTop: 17,
    marginBottom: 8,
    color: '#111827',
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 9,
    padding: 10,
  },
  on: { borderColor: GREEN, backgroundColor: '#F0FDF4' },
  ct: { fontSize: 12, color: '#6B7280' },
  active: { color: GREEN, fontFamily: 'semiBold' },
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