import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getRequest } from '../../api/getRequests';
import { postRequest } from '../../api/postRequests';
import CustomModal from '../../components/customModal';
import CustomSafeArea from '../../components/safeArea';

const GREEN = '#16A34A';
const OPPORTUNITY_TYPES = ['SCHOLARSHIP', 'FELLOWSHIP', 'INTERNSHIP', 'JOB', 'GRANT', 'PROGRAM'];

export default function ApplicationForm() {
  const params = useLocalSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [opportunityId, setOpportunityId] = useState(params.opportunityId || '');

  // Fields for POST /opportunities/bring
  const [extTitle, setExtTitle] = useState('');
  const [extOrganisation, setExtOrganisation] = useState('');
  const [extType, setExtType] = useState('JOB');
  const [externalOpportunityUrl, setExternalOpportunityUrl] = useState('');
  const [extRequirements, setExtRequirements] = useState('');

  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().slice(0, 10));
  const [applicationUrl, setApplicationUrl] = useState('');
  const [source, setSource] = useState(params.opportunityId ? 'FOUND_IN_ROVIA' : 'FOUND_ELSEWHERE');
  const [currentStage, setCurrentStage] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    onPrimaryAction: null,
  });

  const showModal = ({ title, message, type = 'info', onPrimaryAction = null }) => {
    setModal({
      visible: true,
      title,
      message,
      type,
      onPrimaryAction,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false, onPrimaryAction: null }));
  };

  useEffect(() => {
    getRequest('/opportunities')
      .then((r) => {
        const d = r?.data?.opportunities || r?.data || r?.opportunities || r || [];
        setOpportunities(Array.isArray(d) ? d : []);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const hasExternalDetails = Boolean(
    externalOpportunityUrl.trim() || extTitle.trim() || extOrganisation.trim()
  );

  const save = async () => {
    if (!opportunityId.trim() && !hasExternalDetails) {
      showModal({
        title: 'Opportunity required',
        message: 'Select an existing opportunity or fill in the external opportunity details below.',
        type: 'error',
      });
      return;
    }

    if (!opportunityId.trim() && hasExternalDetails) {
      if (!extTitle.trim() || !extOrganisation.trim() || !externalOpportunityUrl.trim()) {
        showModal({
          title: 'Missing opportunity details',
          message: 'Title, organisation, and source link are required when bringing an external opportunity.',
          type: 'error',
        });
        return;
      }
      if (!/^https?:\/\//i.test(externalOpportunityUrl.trim())) {
        showModal({
          title: 'Invalid source link',
          message: 'Source link must start with http:// or https://',
          type: 'error',
        });
        return;
      }
    }

    if (!applicationDate.trim()) {
      showModal({
        title: 'Date required',
        message: 'Enter the date you applied.',
        type: 'error',
      });
      return;
    }

    if (applicationUrl && !/^https?:\/\//i.test(applicationUrl)) {
      showModal({
        title: 'Invalid link',
        message: 'Use a link starting with http:// or https://',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      let selectedOpportunityId = opportunityId;

      if (!selectedOpportunityId && hasExternalDetails) {
        const parsedRequirements = extRequirements
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((item) => ({
            type: 'OTHER',
            description: item,
          }));

          const free = {
          title: extTitle.trim(),
          organisation: extOrganisation.trim(),
          type: extType,
          sourceUrl: externalOpportunityUrl.trim(),
          requirements: parsedRequirements,
          }
        console.log(free)

        const brought = await postRequest('/opportunities/bring', {
          title: extTitle.trim(),
          organisation: extOrganisation.trim(),
          type: extType,
          sourceUrl: externalOpportunityUrl.trim(),
          requirements: parsedRequirements,
        });

        const opportunity = brought?.data?.opportunity || brought?.opportunity || brought?.data || brought;
        selectedOpportunityId = opportunity?._id || opportunity?.id || opportunity?.opportunityId;
        if (!selectedOpportunityId) {
          throw new Error(
            'Rovia saved the external opportunity details but did not return an opportunity ID.'
          );
        }
      }

      const res = await postRequest('/applications', {
        opportunityId: selectedOpportunityId,
        applicationDate: new Date(applicationDate).toISOString(),
        applicationUrl: applicationUrl || undefined,
        source,
        currentStage: currentStage.toUpperCase().replaceAll(' ', '_'),
        notes,
      });

      const created = res?.data?.application || res?.data || res;
      const id = created?._id || created?.id;
      if (id) {
        router.replace({ pathname: '/(subScreens)/applicationDetails', params: { id } });
      } else {
        showModal({
          title: 'Saved',
          message: 'Application saved successfully.',
          type: 'info',
          onPrimaryAction: () => {
            closeModal();
            router.replace('/(tabs)/application');
          },
        });
      }
    // } catch (e) {
    //   showModal({
    //     title: 'Could not save application',
    //     message: e?.data?.message || e.message || 'Please try again.',
    //     type: 'error',
    //   });
    // }
    } catch (e) {
      console.log('Validation fields:', JSON.stringify(e?.data?.error?.fields, null, 2));
      console.log('Save error:', {
        status: e?.status || e?.response?.status,
        data: e?.data || e?.response?.data,
        message: e?.message,
      });
      showModal({
        title: 'Could not save application',
        message: e?.data?.message || e?.response?.data?.message || e.message || 'Please try again.',
        type: 'error',
      });
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <CustomSafeArea>
      <View style={s.top}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={23} color="#111827" />
        </TouchableOpacity>
        <Text style={s.title}>Add application</Text>
        <View style={{ width: 23 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 35 }}>

        <View style={s.extBox}>
          <Text style={s.extTitle}>Bring an opportunity from outside Rovia</Text>
          <Text style={s.hint}>Leave existing opportunity unselected above to create this opportunity first.</Text>

          <Text style={s.label}>Opportunity title *</Text>
          <TextInput
            value={extTitle}
            onChangeText={setExtTitle}
            placeholder="e.g. Frontend Engineer Intern"
            style={s.input}
          />

          <Text style={s.label}>Organisation *</Text>
          <TextInput
            value={extOrganisation}
            onChangeText={setExtOrganisation}
            placeholder="e.g. Paystack"
            style={s.input}
          />

          <Text style={s.label}>Type *</Text>
          <View style={s.rowWrap}>
            {OPPORTUNITY_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setExtType(t)}
                style={[s.choice, s.smallChoice, extType === t && s.choiceOn]}
              >
                <Text style={[s.choiceText, extType === t && s.choiceTextOn]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.label}>Source link (sourceUrl) *</Text>
          <TextInput
            value={externalOpportunityUrl}
            onChangeText={setExternalOpportunityUrl}
            placeholder="https://company.com/opportunity"
            style={s.input}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={s.label}>Requirements (one per line)</Text>
          <TextInput
            value={extRequirements}
            onChangeText={setExtRequirements}
            placeholder="Bachelor's degree&#10;React Native experience"
            multiline
            style={[s.input, { height: 75, textAlignVertical: 'top' }]}
          />
        </View>

        <Text style={s.label}>Application date *</Text>
        <TextInput value={applicationDate} onChangeText={setApplicationDate} placeholder="YYYY-MM-DD" style={s.input} />

        <Text style={s.label}>Application link</Text>
        <TextInput
          value={applicationUrl}
          onChangeText={setApplicationUrl}
          placeholder="https://... (optional)"
          style={s.input}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={s.label}>Where did you find it?</Text>
        <View style={s.row}>
          {[['FOUND_IN_ROVIA', 'Found in Rovia'], ['FOUND_ELSEWHERE', 'Found elsewhere']].map(([v, l]) => (
            <TouchableOpacity
              key={v}
              onPress={() => setSource(v)}
              style={[s.choice, source === v && s.choiceOn]}
            >
              <Text style={[s.choiceText, source === v && s.choiceTextOn]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Current stage</Text>
        <View style={s.rowWrap}>
          {['Applied', 'Assessment', 'Interview', 'Final Stage'].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setCurrentStage(v)}
              style={[s.choice, s.smallChoice, currentStage === v && s.choiceOn]}
            >
              <Text style={[s.choiceText, currentStage === v && s.choiceTextOn]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything you want to remember..."
          multiline
          style={[s.input, { height: 95, textAlignVertical: 'top' }]}
        />

        <TouchableOpacity style={s.submit} disabled={loading} onPress={save}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>Save application</Text>}
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
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  title: { fontSize: 20, fontFamily: 'semiBold', color: '#111827' },
  help: { color: '#6B7280', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  label: { fontSize: 13, fontFamily: 'semiBold', color: '#111827', marginBottom: 7, marginTop: 14 },
  hint: { fontSize: 11, color: '#9CA3AF', marginBottom: 7 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 13, fontSize: 13, color: '#111827', backgroundColor: '#fff' },
  selectList: { maxHeight: 190, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden' },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center' },
  optionOn: { backgroundColor: '#F0FDF4' },
  optionTitle: { fontSize: 13, fontFamily: 'medium', color: '#111827' },
  extBox: {
    // marginTop: 18,
    padding: 14,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: '#D1FAE5',
    backgroundColor: '#F9FAFB',
  },
  extTitle: { fontSize: 14, fontFamily: 'semiBold', color: '#111827', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 9, padding: 11, alignItems: 'center' },
  smallChoice: { flex: 0, width: '48%' },
  choiceOn: { borderColor: GREEN, backgroundColor: '#F0FDF4' },
  choiceText: { fontSize: 11, color: '#6B7280' },
  choiceTextOn: { color: GREEN, fontFamily: 'semiBold' },
  submit: { backgroundColor: GREEN, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 25 },
  submitText: { color: '#fff', fontFamily: 'semiBold' },
  skeletonList: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden', backgroundColor: '#fff' },
  skeletonRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 6 },
  skeletonTitle: { width: '65%', height: 13, borderRadius: 4, backgroundColor: '#E5E7EB' },
  skeletonSub: { width: '40%', height: 10, borderRadius: 4, backgroundColor: '#F3F4F6' },
});