// ── Mock Data ─────────────────────────────────────────────────

export interface SliderConfig {
  maxFinancingAmount: number
  maxRevenueShareRatio: number
  maxCooperationTerm: number
  pcf: number
  yito: number
}

export interface CalculatedMetrics {
  totalRepayment: number
  monthlyRepayment: number
  irr: number
  paybackMonths: number
  recoveryMultiple: number
}

export interface TermsProposal {
  id: string
  proposedBy: 'investor' | 'borrower'
  financingAmount: number
  revenueShareRatio: number
  cooperationTerm: number
  pcf: number
  yito: number
  calculatedMetrics: CalculatedMetrics
  note?: string
  createdAt: string
}

export type NegotiationStatus = 'negotiating' | 'agreed' | 'rejected' | 'expired'

export interface TermsNegotiation {
  id: string
  projectId: string
  projectName: string
  industry: string
  investorId: string
  investorName: string
  borrowerId: string
  borrowerName: string
  status: NegotiationStatus
  sliderConfig: SliderConfig
  currentProposal: TermsProposal
  proposals: TermsProposal[]
  savedScenarios: TermsProposal[]
  createdAt: string
  updatedAt: string
}

export interface HistoryCase {
  industry: string
  amount: number
  ratio: number
  term: number
  irr: number
  outcome: string
}

// ── Mock Slider Config ────────────────────────────────────────
export const mockSliderConfig: SliderConfig = {
  maxFinancingAmount: 500,
  maxRevenueShareRatio: 20,
  maxCooperationTerm: 48,
  pcf: 85,
  yito: 0.15,
}

// ── Mock Negotiations ─────────────────────────────────────────
export const mockNegotiations: TermsNegotiation[] = [
  {
    id: 'tn-001',
    projectId: 'proj-001',
    projectName: '星火餐饮连锁',
    industry: 'catering',
    investorId: 'u-002',
    investorName: '李四（新锐资本）',
    borrowerId: 'u-001',
    borrowerName: '张三（星火餐饮）',
    status: 'negotiating',
    sliderConfig: mockSliderConfig,
    currentProposal: {
      id: 'tp-003',
      proposedBy: 'investor',
      financingAmount: 400,
      revenueShareRatio: 15,
      cooperationTerm: 36,
      pcf: 85,
      yito: 0.15,
      calculatedMetrics: {
        totalRepayment: 459,
        monthlyRepayment: 12.75,
        irr: 18.2,
        paybackMonths: 32,
        recoveryMultiple: 1.15,
      },
      note: '建议分成比例从18%降至15%，期限可延长至36个月',
      createdAt: '2026-02-18T14:30:00',
    },
    proposals: [
      {
        id: 'tp-001',
        proposedBy: 'borrower',
        financingAmount: 500,
        revenueShareRatio: 10,
        cooperationTerm: 24,
        pcf: 85,
        yito: 0.15,
        calculatedMetrics: {
          totalRepayment: 204,
          monthlyRepayment: 8.5,
          irr: 8.5,
          paybackMonths: 59,
          recoveryMultiple: 0.41,
        },
        note: '希望融资500万，分成比例控制在10%以内',
        createdAt: '2026-02-17T10:00:00',
      },
      {
        id: 'tp-002',
        proposedBy: 'investor',
        financingAmount: 350,
        revenueShareRatio: 18,
        cooperationTerm: 30,
        pcf: 85,
        yito: 0.15,
        calculatedMetrics: {
          totalRepayment: 459,
          monthlyRepayment: 15.3,
          irr: 22.1,
          paybackMonths: 23,
          recoveryMultiple: 1.31,
        },
        note: '融资金额可到350万，但分成比例至少18%',
        createdAt: '2026-02-17T15:00:00',
      },
      {
        id: 'tp-003',
        proposedBy: 'investor',
        financingAmount: 400,
        revenueShareRatio: 15,
        cooperationTerm: 36,
        pcf: 85,
        yito: 0.15,
        calculatedMetrics: {
          totalRepayment: 459,
          monthlyRepayment: 12.75,
          irr: 18.2,
          paybackMonths: 32,
          recoveryMultiple: 1.15,
        },
        note: '建议分成比例从18%降至15%，期限可延长至36个月',
        createdAt: '2026-02-18T14:30:00',
      },
    ],
    savedScenarios: [],
    createdAt: '2026-02-17',
    updatedAt: '2026-02-18',
  },
  {
    id: 'tn-002',
    projectId: 'proj-003',
    projectName: '优学教育科技',
    industry: 'education',
    investorId: 'u-002',
    investorName: '李四（新锐资本）',
    borrowerId: 'u-003',
    borrowerName: '王五（优学教育）',
    status: 'agreed',
    sliderConfig: {
      maxFinancingAmount: 200,
      maxRevenueShareRatio: 15,
      maxCooperationTerm: 36,
      pcf: 38,
      yito: 0.12,
    },
    currentProposal: {
      id: 'tp-010',
      proposedBy: 'borrower',
      financingAmount: 200,
      revenueShareRatio: 12,
      cooperationTerm: 30,
      pcf: 38,
      yito: 0.12,
      calculatedMetrics: {
        totalRepayment: 136.8,
        monthlyRepayment: 4.56,
        irr: 14.5,
        paybackMonths: 44,
        recoveryMultiple: 0.68,
      },
      note: '双方达成一致',
      createdAt: '2026-02-15T16:00:00',
    },
    proposals: [],
    savedScenarios: [],
    createdAt: '2026-02-14',
    updatedAt: '2026-02-15',
  },
]

// ── Mock History Cases ────────────────────────────────────────
export const mockHistoryCases: HistoryCase[] = [
  { industry: '餐饮', amount: 300, ratio: 12, term: 24, irr: 15.5, outcome: '成功回收' },
  { industry: '餐饮', amount: 500, ratio: 16, term: 36, irr: 19.2, outcome: '成功回收' },
  { industry: '零售', amount: 200, ratio: 10, term: 18, irr: 12.8, outcome: '成功回收' },
  { industry: '教育', amount: 150, ratio: 8, term: 24, irr: 11.5, outcome: '成功回收' },
  { industry: '演出', amount: 800, ratio: 18, term: 12, irr: 25.3, outcome: '成功回收' },
  { industry: 'SaaS', amount: 400, ratio: 14, term: 30, irr: 17.8, outcome: '成功回收' },
]

// ── Industry Icons ────────────────────────────────────────────
export const industryIcons: Record<string, string> = {
  catering: '🍜',
  retail: '🛍️',
  education: '📚',
  concert: '🎭',
  saas: '💻',
  healthcare: '🏥',
  ecommerce: '🛒',
  service: '🔧',
}

// ── Status Config ─────────────────────────────────────────────
export const statusConfig: Record<string, { icon: string; color: string; bg: string }> = {
  negotiating: { icon: '⏳', color: '#5DC4B3', bg: '#F0FDFA' },
  agreed: { icon: '✓', color: '#34c759', bg: '#dcfce7' },
  rejected: { icon: '✕', color: '#ff375f', bg: '#fee2e2' },
  expired: { icon: '⏰', color: '#86868b', bg: '#f5f5f7' },
}
