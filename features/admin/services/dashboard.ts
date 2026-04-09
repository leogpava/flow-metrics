import 'server-only';

import type {
  AdminDemographicsResponse,
  AdminEngagementResponse,
  AdminHealthResponse,
  AdminOverviewResponse,
  AdminSessionRow,
  AdminSessionsFilters,
  AdminSessionsResponse,
  DemographicDistribution,
  DistributionDatum,
  MetricDelta,
  SegmentPerformance,
  TrendDatum,
} from '@/features/admin/types/dashboard';
import { getPreviousRange } from '@/features/admin/utils/date';
import { getActivityLabel, getDeltaDirection, getGenderLabel } from '@/features/admin/utils/format';
import { getSupabaseServerClient } from '@/lib/supabase/server';

type SessionRecord = AdminSessionRow;

const ACTIVITY_KEYS = ['sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso'] as const;
const AGE_RANGES = [
  { key: '18-25', label: '18-25', min: 18, max: 25 },
  { key: '26-35', label: '26-35', min: 26, max: 35 },
  { key: '36-45', label: '36-45', min: 36, max: 45 },
  { key: '46-55', label: '46-55', min: 46, max: 55 },
  { key: '56+', label: '56+', min: 56, max: Number.POSITIVE_INFINITY },
] as const;

function getAdminSupabase() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    throw new Error('Supabase server não está configurado.');
  }

  return supabase;
}

function serializeRange(startDate: Date, endDate: Date) {
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function averageOrNull(values: Array<number | null>) {
  const filtered = values.filter((value): value is number => value !== null);
  if (!filtered.length) return null;
  return round(average(filtered), 1);
}

function buildDelta(current: number, previous: number, relative = false): MetricDelta {
  const value =
    relative && previous > 0 ? ((current - previous) / previous) * 100 : current - previous;
  const rounded = round(value, 1);

  return {
    value: rounded,
    direction: getDeltaDirection(rounded),
  };
}

function groupAverageByDay(
  sessions: SessionRecord[],
  selector: (session: SessionRecord) => number | null | undefined
): TrendDatum[] {
  const grouped = new Map<string, number[]>();

  for (const session of sessions) {
    const value = selector(session);
    if (value === null || value === undefined) continue;

    const key = session.created_at.slice(0, 10);
    const entry = grouped.get(key) ?? [];
    entry.push(value);
    grouped.set(key, entry);
  }

  return Array.from(grouped.entries()).map(([date, values]) => ({
    date,
    label: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(
      new Date(date)
    ),
    value: round(average(values), 1),
    secondaryValue: values.length,
  }));
}

function classifyIMC(imc: number) {
  if (imc < 18.5) return { key: 'abaixo_peso', label: 'Abaixo do peso' };
  if (imc < 25) return { key: 'normal', label: 'Faixa saudável' };
  if (imc < 30) return { key: 'sobrepeso', label: 'Sobrepeso' };
  if (imc < 35) return { key: 'obesidade_1', label: 'Obesidade grau I' };
  if (imc < 40) return { key: 'obesidade_2', label: 'Obesidade grau II' };
  return { key: 'obesidade_3', label: 'Obesidade grau III' };
}

function buildIMCDistribution(sessions: SessionRecord[]): DistributionDatum[] {
  const distribution = new Map<string, DistributionDatum>();

  sessions.forEach((session) => {
    const classification = classifyIMC(session.imc);
    const current = distribution.get(classification.key) ?? {
      key: classification.key,
      label: classification.label,
      value: 0,
    };
    current.value += 1;
    distribution.set(classification.key, current);
  });

  return Array.from(distribution.values());
}

function buildActivityDistribution(sessions: SessionRecord[]): DistributionDatum[] {
  return ACTIVITY_KEYS.map((key) => ({
    key,
    label: getActivityLabel(key),
    value: sessions.filter((session) => session.atividade === key).length,
  }));
}

function buildGenderSegments(sessions: SessionRecord[]): SegmentPerformance[] {
  const groups = new Map<string, SessionRecord[]>();

  sessions.forEach((session) => {
    const key = session.sexo || 'nao_informado';
    groups.set(key, [...(groups.get(key) ?? []), session]);
  });

  return Array.from(groups.entries()).map(([key, values]) => ({
    key,
    label: getGenderLabel(key),
    count: values.length,
    averageScore: round(average(values.map((session) => session.score)), 1),
    averageIMC: round(average(values.map((session) => session.imc)), 1),
  }));
}

function buildAgeSegments(sessions: SessionRecord[]): SegmentPerformance[] {
  return AGE_RANGES.map((range) => {
    const values = sessions.filter(
      (session) => session.idade >= range.min && session.idade <= range.max
    );

    return {
      key: range.key,
      label: range.label,
      count: values.length,
      averageScore: round(average(values.map((session) => session.score)), 1),
      averageIMC: round(average(values.map((session) => session.imc)), 1),
    };
  });
}

function buildDemographicDistribution(
  groups: Map<string, SessionRecord[]>,
  labelResolver: (key: string) => string
): DemographicDistribution[] {
  return Array.from(groups.entries()).map(([key, values]) => ({
    key,
    label: labelResolver(key),
    count: values.length,
    averageScore: round(average(values.map((session) => session.score)), 1),
    averageIMC: round(average(values.map((session) => session.imc)), 1),
    averageNPS: averageOrNull(values.map((session) => session.nps)),
    emailSentRate: round(
      values.length ? (values.filter((session) => session.email_sent).length / values.length) * 100 : 0,
      1
    ),
  }));
}

async function fetchSessionsInRange(startDate: Date, endDate: Date) {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('sessions')
    .select(
      'id, created_at, nome, sexo, idade, peso, altura, atividade, imc, score, email, email_sent, nps, tmb, get_total, hidratacao, percentil'
    )
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SessionRecord[];
}

export async function getAdminOverview(startDate: Date, endDate: Date): Promise<AdminOverviewResponse> {
  const previousRange = getPreviousRange(startDate, endDate);
  const [currentSessions, previousSessions] = await Promise.all([
    fetchSessionsInRange(startDate, endDate),
    fetchSessionsInRange(previousRange.startDate, previousRange.endDate),
  ]);

  const completionSessions = currentSessions.filter((session) => session.score > 0);
  const previousCompletionSessions = previousSessions.filter((session) => session.score > 0);
  const currentAverageNPS = averageOrNull(currentSessions.map((session) => session.nps));
  const previousAverageNPS = averageOrNull(previousSessions.map((session) => session.nps));
  const activeThreshold = new Date(endDate);
  activeThreshold.setDate(activeThreshold.getDate() - 6);

  const metrics = {
    totalUsers: currentSessions.length,
    completionRate: round(
      currentSessions.length ? (completionSessions.length / currentSessions.length) * 100 : 0,
      1
    ),
    averageScore: round(average(completionSessions.map((session) => session.score)), 1),
    averageIMC: round(average(currentSessions.map((session) => session.imc)), 1),
    averageNPS: currentAverageNPS,
    emailSentRate: round(
      currentSessions.length
        ? (currentSessions.filter((session) => session.email_sent).length / currentSessions.length) * 100
        : 0,
      1
    ),
    activeUsersLast7Days: currentSessions.filter(
      (session) => new Date(session.created_at) >= activeThreshold
    ).length,
  };

  return {
    generatedAt: new Date().toISOString(),
    range: serializeRange(startDate, endDate),
    previousRange: serializeRange(previousRange.startDate, previousRange.endDate),
    metrics,
    deltas: {
      totalUsers: buildDelta(metrics.totalUsers, previousSessions.length, true),
      completionRate: buildDelta(
        metrics.completionRate,
        round(
          previousSessions.length
            ? (previousCompletionSessions.length / previousSessions.length) * 100
            : 0,
          1
        )
      ),
      averageScore: buildDelta(
        metrics.averageScore,
        round(average(previousCompletionSessions.map((session) => session.score)), 1)
      ),
      averageNPS:
        currentAverageNPS !== null || previousAverageNPS !== null
          ? buildDelta(currentAverageNPS ?? 0, previousAverageNPS ?? 0)
          : null,
    },
    charts: {
      scoreTrend: groupAverageByDay(currentSessions, (session) =>
        session.score > 0 ? session.score : null
      ),
      imcDistribution: buildIMCDistribution(currentSessions),
      activityDistribution: buildActivityDistribution(currentSessions),
    },
  };
}

export async function getAdminHealth(startDate: Date, endDate: Date): Promise<AdminHealthResponse> {
  const sessions = await fetchSessionsInRange(startDate, endDate);

  return {
    generatedAt: new Date().toISOString(),
    range: serializeRange(startDate, endDate),
    summary: {
      totalUsers: sessions.length,
      averageIMC: round(average(sessions.map((session) => session.imc)), 1),
      averageScore: round(average(sessions.map((session) => session.score)), 1),
    },
    charts: {
      imcTrend: groupAverageByDay(sessions, (session) => session.imc),
      scoreTrend: groupAverageByDay(sessions, (session) => (session.score > 0 ? session.score : null)),
    },
    segments: {
      byGender: buildGenderSegments(sessions),
      byAgeRange: buildAgeSegments(sessions),
    },
  };
}

function buildMeasurement(values: number[]) {
  if (!values.length) {
    return { average: 0, min: 0, max: 0, total: 0 };
  }

  return {
    average: round(average(values), 1),
    min: Math.min(...values),
    max: Math.max(...values),
    total: values.length,
  };
}

export async function getAdminDemographics(
  startDate: Date,
  endDate: Date
): Promise<AdminDemographicsResponse> {
  const sessions = await fetchSessionsInRange(startDate, endDate);
  const byGender = new Map<string, SessionRecord[]>();
  const byAgeRange = new Map<string, SessionRecord[]>();
  const byActivity = new Map<string, SessionRecord[]>();

  for (const session of sessions) {
    byGender.set(session.sexo, [...(byGender.get(session.sexo) ?? []), session]);
    byActivity.set(session.atividade, [...(byActivity.get(session.atividade) ?? []), session]);

    const range = AGE_RANGES.find(
      (item) => session.idade >= item.min && session.idade <= item.max
    ) ?? AGE_RANGES[AGE_RANGES.length - 1];
    byAgeRange.set(range.key, [...(byAgeRange.get(range.key) ?? []), session]);
  }

  const weightValues = sessions.map((session) => Number(session.peso)).filter(Boolean);
  const heightValues = sessions.map((session) => Number(session.altura)).filter(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    range: serializeRange(startDate, endDate),
    summary: {
      totalUsers: sessions.length,
      averageWeight: round(average(weightValues), 1),
      averageHeight: round(average(heightValues), 1),
    },
    measurements: {
      weight: buildMeasurement(weightValues),
      height: buildMeasurement(heightValues),
    },
    distributions: {
      byGender: buildDemographicDistribution(byGender, getGenderLabel),
      byAgeRange: AGE_RANGES.map((range) => {
        const values = byAgeRange.get(range.key) ?? [];
        return {
          key: range.key,
          label: range.label,
          count: values.length,
          averageScore: round(average(values.map((session) => session.score)), 1),
          averageIMC: round(average(values.map((session) => session.imc)), 1),
          averageNPS: averageOrNull(values.map((session) => session.nps)),
        };
      }),
      byActivity: buildDemographicDistribution(byActivity, getActivityLabel),
    },
  };
}

export async function getAdminEngagement(
  startDate: Date,
  endDate: Date
): Promise<AdminEngagementResponse> {
  const sessions = await fetchSessionsInRange(startDate, endDate);
  const responses = sessions.filter((session) => session.nps !== null);
  const promoters = responses.filter((session) => (session.nps ?? 0) >= 9).length;
  const passives = responses.filter((session) => {
    const value = session.nps ?? 0;
    return value >= 7 && value <= 8;
  }).length;
  const detractors = responses.filter((session) => (session.nps ?? 0) <= 6).length;
  const npsScore = responses.length ? ((promoters - detractors) / responses.length) * 100 : 0;

  return {
    generatedAt: new Date().toISOString(),
    range: serializeRange(startDate, endDate),
    summary: {
      totalSessions: sessions.length,
      emailSentRate: round(
        sessions.length ? (sessions.filter((session) => session.email_sent).length / sessions.length) * 100 : 0,
        1
      ),
      npsRespondents: responses.length,
      averageNPS: averageOrNull(responses.map((session) => session.nps)),
      npsScore: round(npsScore, 1),
    },
    distribution: [
      { key: 'promoters', label: 'Promotores', value: promoters },
      { key: 'passives', label: 'Neutros', value: passives },
      { key: 'detractors', label: 'Detratores', value: detractors },
    ],
    charts: {
      npsTrend: groupAverageByDay(responses, (session) => session.nps),
      emailTrend: groupAverageByDay(sessions, (session) => (session.email_sent ? 100 : 0)),
    },
  };
}

export async function getAdminSessions(
  filters: AdminSessionsFilters
): Promise<AdminSessionsResponse> {
  const supabase = getAdminSupabase();
  const page = Math.max(1, Number.parseInt(filters.page ?? '1', 10) || 1);
  const pageSize = Math.min(50, Math.max(10, Number.parseInt(filters.pageSize ?? '20', 10) || 20));

  let query = supabase
    .from('sessions')
    .select(
      'id, created_at, nome, sexo, idade, peso, altura, atividade, imc, score, email, email_sent, nps, tmb, get_total, hidratacao, percentil',
      { count: 'exact' }
    )
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate)
    .order('created_at', { ascending: false });

  if (filters.sexo) query = query.eq('sexo', filters.sexo);
  if (filters.atividade) query = query.eq('atividade', filters.atividade);
  if (filters.minScore) query = query.gte('score', Number.parseInt(filters.minScore, 10));
  if (filters.maxScore) query = query.lte('score', Number.parseInt(filters.maxScore, 10));

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    generatedAt: new Date().toISOString(),
    range: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    },
    sessions: (data ?? []) as SessionRecord[],
  };
}
