export type ActivityLevel =
  | 'sedentario'
  | 'leve'
  | 'moderado'
  | 'intenso'
  | 'muito_intenso';

export type IMCClassification =
  | 'abaixo_peso'
  | 'normal'
  | 'sobrepeso'
  | 'obesidade_1'
  | 'obesidade_2'
  | 'obesidade_3';

export interface UserData {
  nome: string;
  sexo: 'masculino' | 'feminino';
  idade: number;
  peso: number;
  altura: number;
  atividade: ActivityLevel;
}

export interface HealthMetrics {
  imc: number;
  imcClassification: IMCClassification;
  score: number;
  scoreLevel: 'critico' | 'atencao' | 'bom' | 'otimo';
  insight: string;
  tmb: number;
  get: number;
  hidratacao: number;
  percentilIMC: string;
  percentilContexto: string;
}

export interface FlowState {
  step: number;
  userData: Partial<UserData>;
  metrics: HealthMetrics | null;
  email: string;
  emailSent: boolean;
  sessionId: string;
}
