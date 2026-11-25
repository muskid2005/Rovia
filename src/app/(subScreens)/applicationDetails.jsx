import { Feather } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { getRequest } from '../../api/getRequests';
import CustomSafeArea from '../../components/safeArea';

const GREEN = '#16A34A';

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString(undefined, { timeZone: 'UTC' })
    : 'Not set';

function SkeletonBlock({ style }) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 700 }),
        withTiming(0.45, { duration: 700 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[s.skeletonBase, style, animStyle]} />;
}

function DetailsSkeleton() {
  return (
    <View style={{ paddingTop: 4 }}>
      <View style={s.hero}>
        <SkeletonBlock style={{ width: '68%', height: 20, borderRadius: 6 }} />
        <SkeletonBlock
          style={{ width: '42%', height: 14, borderRadius: 6, marginTop: 8 }}
        />
        <SkeletonBlock
          style={{ width: 92, height: 24, borderRadius: 6, marginTop: 14 }}
        />
        <SkeletonBlock
          style={{ width: '52%', height: 12, borderRadius: 6, marginTop: 12 }}
        />
      </View>

      <SkeletonBlock
        style={{ width: 150, height: 16, borderRadius: 6, marginTop: 24, marginBottom: 14 }}
      />
      {[0, 1].map((item) => (
        <View key={item} style={s.timeline}>
          <SkeletonBlock style={{ width: 10, height: 10, borderRadius: 5, marginTop: 4 }} />
          <View style={{ flex: 1 }}>
            <SkeletonBlock style={{ width: '45%', height: 14, borderRadius: 6 }} />
            <SkeletonBlock
              style={{ width: '60%', height: 12, borderRadius: 6, marginTop: 6 }}
            />
          </View>
        </View>
      ))}

      <SkeletonBlock
        style={{ width: 100, height: 16, borderRadius: 6, marginTop: 12, marginBottom: 12 }}
      />
      <View style={s.box}>
        <SkeletonBlock style={{ width: '40%', height: 14, borderRadius: 6 }} />
        <SkeletonBlock
          style={{ width: '70%', height: 12, borderRadius: 6, marginTop: 8 }}
        />
      </View>
    </View>
  );
}

export default function ApplicationDetails() {
  const { id } = useLocalSearchParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const r = await getRequest(`/applications/${id}`);
      setApp(r?.data?.application || r?.data || r);
    } catch (e) {
      setError(
        e?.data?.message || e.message || 'Could not load this application.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={s.top}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={23} color="#111827" />
          </TouchableOpacity>
          <Text style={s.topTitle}>Application details</Text>
          <View style={{ width: 23 }} />
        </View>
        <DetailsSkeleton />
      </CustomSafeArea>
    );
  }

  if (error || !app) {
    return (
      <CustomSafeArea>
        <View style={s.top}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={23} color="#111827" />
          </TouchableOpacity>
          <Text style={s.topTitle}>Application details</Text>
          <View style={{ width: 23 }} />
        </View>
        <Text style={s.error}>{error || 'Application not found.'}</Text>
        <TouchableOpacity onPress={load} style={{ marginTop: 12 }}>
          <Text style={s.link}>Try again</Text>
        </TouchableOpacity>
      </CustomSafeArea>
    );
  }

  const op = app.opportunity || {};
  const stages = Array.isArray(app.stages) ? app.stages : [];
  const hasAppliedStage = stages.some(
    (st) => String(st?.stageType || '').toUpperCase() === 'APPLIED'
  );
  const timelineStages = hasAppliedStage
    ? stages
    : [
        {
          id: 'applied-default',
          stageType: 'Applied',
          status: 'COMPLETED',
          completionDate: app.applicationDate,
        },
        ...stages,
      ];

  const outcomeType = app.outcome?.outcomeType || app.outcomeType;
  const outcomeDate = app.outcome?.outcomeDate || app.outcomeDate;
  const outcomeNotes = app.outcome?.outcomeNotes || app.outcomeNotes;
  const closed =
    !!outcomeType ||
    ['CLOSED', 'COMPLETED'].includes(String(app.status || '').toUpperCase());

  return (
    <CustomSafeArea>
      <View style={s.top}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={23} color="#111827" />
        </TouchableOpacity>
        <Text style={s.topTitle}>Application details</Text>
        <TouchableOpacity onPress={load}>
          <Feather name="refresh-cw" size={18} color={GREEN} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 35 }}
      >
        <View style={s.hero}>
          <Text style={s.role}>{op.title || app.role || 'Application'}</Text>
          <Text style={s.org}>
            {op.organisation || app.organisation || 'Organisation not provided'}
          </Text>
          <View style={s.pill}>
            <Text style={s.pillText}>
              {String(
                outcomeType || app.currentStage || app.status || 'Applied'
              ).replaceAll('_', ' ')}
            </Text>
          </View>
          <Text style={s.meta}>Applied: {fmtDate(app.applicationDate)}</Text>
          {app.applicationUrl ? (
            <Text style={s.meta}>Application link: {app.applicationUrl}</Text>
          ) : null}
        </View>

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Application timeline</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(subScreens)/applicationStage',
                params: { id },
              })
            }
          >
            <Text style={s.link}>+ Add stage</Text>
          </TouchableOpacity>
        </View>

        {timelineStages.map((st, i) => (
          <View key={st._id || st.id || i} style={s.timeline}>
            <View style={s.bullet} />
            <View style={{ flex: 1 }}>
              <Text style={s.stageName}>
                {String(st.stageType || st.name || 'Stage').replaceAll(
                  '_',
                  ' '
                )}
              </Text>
              <Text style={s.meta}>
                {String(st.status || 'PLANNED').replaceAll('_', ' ')}
                {st.scheduledDate ? ` · ${fmtDate(st.scheduledDate)}` : ''}
              </Text>
              {st.notes ? <Text style={s.note}>{st.notes}</Text> : null}
            </View>
          </View>
        ))}

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Outcome</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(subScreens)/applicationOutcome',
                params: { id },
              })
            }
          >
            <Text style={s.link}>{closed ? 'Update' : 'Record outcome'}</Text>
          </TouchableOpacity>
        </View>

        <View style={s.box}>
          <Text style={s.stageName}>
            {outcomeType
              ? String(outcomeType).replaceAll('_', ' ')
              : 'Not recorded yet'}
          </Text>
          <Text style={s.meta}>
            {outcomeDate
              ? fmtDate(outcomeDate)
              : 'You can record the result when you hear back.'}
          </Text>
          {outcomeNotes ? <Text style={s.note}>{outcomeNotes}</Text> : null}
        </View>

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Notes</Text>
        </View>

        <View style={s.box}>
          <Text style={s.note}>{app.notes || 'No notes added.'}</Text>
        </View>
      </ScrollView>
    </CustomSafeArea>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  topTitle: { fontSize: 19, fontFamily: 'semiBold', color: '#111827' },
  hero: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
  },
  role: { fontSize: 18, fontFamily: 'semiBold', color: '#111827' },
  org: { fontSize: 13, color: '#6B7280', marginTop: 5 },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 12,
  },
  pillText: { fontSize: 11, color: GREEN, fontFamily: 'semiBold' },
  meta: { fontSize: 11, color: '#6B7280', marginTop: 7 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'semiBold', color: '#111827' },
  link: { color: GREEN, fontSize: 12, fontFamily: 'semiBold' },
  timeline: { flexDirection: 'row', gap: 12, paddingBottom: 20 },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: GREEN,
    marginTop: 4,
  },
  stageName: { fontSize: 13, fontFamily: 'semiBold', color: '#111827' },
  note: { fontSize: 12, color: '#4B5563', marginTop: 6, lineHeight: 18 },
  box: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 11,
    padding: 14,
  },
  error: { color: '#B91C1C', marginTop: 40 },
  skeletonBase: {
    backgroundColor: '#E5E7EB',
  },
});