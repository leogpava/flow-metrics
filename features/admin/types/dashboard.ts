export type AdminViewKey =
  | 'overview'
  | 'health'
  | 'demographics'
  | 'engagement'
  | 'sessions';

export interface AdminDateRange {
  startDate: string;
  endDate: string;
}

export interface AdminOverviewMetrics {
  totalUsers: number;
  completionRate: number;
  averageScore: number;
  averageIMC: number;
  averageNPS: number | null;
  emailSentRate: number;
  activeUsersLast7Days: number;
}

export interface MetricDelta {
  value: number;
  direction: 'up' | 'down' | 'flat';
}

export interface DistributionDatum {
  key: string;
  label: string;
  value: number;
}

export interface TrendDatum {
  date: string;
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface AdminOverviewResponse {
  generatedAt: string;
  range: AdminDateRange;
  previousRange: AdminDateRange;
  metrics: AdminOverviewMetrics;
  deltas: {
    totalUsers: MetricDelta;
    completionRate: MetricDelta;
    averageScore: MetricDelta;
    averageNPS: MetricDelta | null;
  };
  charts: {
    scoreTrend: TrendDatum[];
    imcDistribution: DistributionDatum[];
    activityDistribution: DistributionDatum[];
  };
}

export interface SegmentPerformance {
  key: string;
  label: string;
  count: number;
  averageScore: number;
  averageIMC: number;
}

export interface AdminHealthResponse {
  generatedAt: string;
  range: AdminDateRange;
  summary: {
    totalUsers: number;
    averageIMC: number;
    averageScore: number;
  };
  charts: {
    imcTrend: TrendDatum[];
    scoreTrend: TrendDatum[];
  };
  segments: {
    byGender: SegmentPerformance[];
    byAgeRange: SegmentPerformance[];
  };
}

export interface DemographicStat {
  average: number;
  min: number;
  max: number;
  total: number;
}

export interface DemographicDistribution {
  key: string;
  label: string;
  count: number;
  averageScore: number;
  averageIMC?: number;
  averageNPS: number | null;
  emailSentRate?: number;
}

export interface AdminDemographicsResponse {
  generatedAt: string;
  range: AdminDateRange;
  summary: {
    totalUsers: number;
    averageWeight: number;
    averageHeight: number;
  };
  measurements: {
    weight: DemographicStat;
    height: DemographicStat;
  };
  distributions: {
    byGender: DemographicDistribution[];
    byAgeRange: DemographicDistribution[];
    byActivity: DemographicDistribution[];
  };
}

export interface AdminEngagementResponse {
  generatedAt: string;
  range: AdminDateRange;
  summary: {
    totalSessions: number;
    emailSentRate: number;
    npsRespondents: number;
    averageNPS: number | null;
    npsScore: number;
  };
  distribution: DistributionDatum[];
  charts: {
    npsTrend: TrendDatum[];
    emailTrend: TrendDatum[];
  };
}

export interface AdminSessionRow {
  id: string;
  created_at: string;
  nome: string;
  sexo: string;
  idade: number;
  peso: number;
  altura: number;
  atividade: string;
  imc: number;
  score: number;
  email: string | null;
  email_sent: boolean;
  nps: number | null;
  tmb: number | null;
  get_total: number | null;
  hidratacao: number | null;
  percentil: string | null;
}

export interface AdminSessionsFilters extends AdminDateRange {
  sexo?: string;
  atividade?: string;
  minScore?: string;
  maxScore?: string;
  page?: string;
  pageSize?: string;
}

export interface AdminSessionsResponse {
  generatedAt: string;
  range: AdminDateRange;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  sessions: AdminSessionRow[];
}
