export const BillingCycle = {
  MONTHLY: "monthly",
  TERMLY: "termly",
} as const

export type BillingCycleType = (typeof BillingCycle)[keyof typeof BillingCycle]

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher"
}

export interface ClassGroup {
  id: string
  name: string
  enabled: boolean
  standardFee: number
  classes: string[]
}

export interface FeePayment {
  period: number
  amountDue: number
  amountPaid: number
  paid: boolean
  dueDate: string
  paidDate?: string
  isTransportWaived: boolean
  outstandingAmount: number
}

export interface TransportPayment {
  month: number
  monthName: string
  amountDue: number
  amountPaid: number
  paid: boolean
  dueDate: string
  paidDate?: string
  isWaived: boolean
  outstandingAmount: number
  isActive: boolean
  isSkipped: boolean
}

export type Gender = 'Male' | 'Female' | 'Other' | ''

export interface Student {
  id: string
  fullName: string
  gender: Gender
  dateOfBirth: string
  parentContact: string
  address: string
  admissionDate: string
  academicYear: string
  classGroup: string
  className: string
  feePayments: FeePayment[]
  totalPaid: number
  totalOwed: number
  notes?: string
  isTransferred?: boolean
  transferDate?: string
  hasTransport: boolean
  transportFee: number
  transportActivationDate?: string
  transportPayments?: TransportPayment[]
}

export interface TransferredStudent extends Student {
  transferReason: string
  originalClassGroup: string
  originalClassName: string
  newSchool: string
  paymentHistoryRetained: boolean
  originalAdmissionDate: string
}

export interface PendingPromotedStudent extends Student {
  promotionDate: string
  fromClass: string
  toClass: string
  promotionType: "ECD_B_TO_GRADE_1" | "MANUAL" | "AUTO_GRADE_PROMOTION"
  canBeRestored: boolean
  originalData: Student
}

export interface AppSettings {
  schoolName: string
  classGroups: ClassGroup[]
  autoPromotionEnabled: boolean
  transferRetentionYears: number
  savedClassNames: string[]
  billingCycle: BillingCycleType
  paymentDueDate: number
  transportDueDate: number
  promotionThreshold?: number
  graduationClassGroup?: string
  autoPromotionDate?: string
  currency?: string
}

export interface LicenseData {
  schoolName: string
  licenseType: string
  issuedOn: string
  expiresOn: string
  features: string[]
}

export const DEFAULT_CLASS_GROUPS: ClassGroup[] = [
  { id: "ecd-ab", name: "ECD A & B", enabled: false, standardFee: 25, classes: ["ECD A", "ECD B"] },
  {
    id: "grade-1-7",
    name: "Grade 1–7",
    enabled: false,
    standardFee: 30,
    classes: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7"],
  },
  {
    id: "form-1-6",
    name: "Form 1–6",
    enabled: false,
    standardFee: 50,
    classes: ["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Form 6"],
  },
  { id: "college", name: "College", enabled: false, standardFee: 75, classes: ["Lower 6", "Upper 6"] },
]

export const DEFAULT_SETTINGS: AppSettings = {
  schoolName: "My School",
  classGroups: DEFAULT_CLASS_GROUPS,
  autoPromotionEnabled: true,
  transferRetentionYears: 5,
  savedClassNames: [],
  billingCycle: BillingCycle.MONTHLY,
  paymentDueDate: 1,
  transportDueDate: 7,
  promotionThreshold: 50,
  graduationClassGroup: "form-1-6",
  autoPromotionDate: "01-01",
  currency: "USD"
}

export const TERMS = [
  { name: "Term 1", months: [1, 2, 3, 4], period: 1 },
  { name: "Term 2", months: [5, 6, 7, 8], period: 2 },
  { name: "Term 3", months: [9, 10, 11, 12], period: 3 },
]

export const TRANSPORT_MONTHS = [1, 2, 3, 5, 6, 7, 9, 10, 11]

export const FEE_STATUS = {
  PAID_IN_FULL: "paid_in_full",
  PARTIAL_PAYMENT: "partial_payment",
  UNPAID: "unpaid",
  FUTURE: "future",
  SKIPPED: "skipped",
  WAIVED: "waived",
} as const

export type FeeStatusType = (typeof FEE_STATUS)[keyof typeof FEE_STATUS]

export interface PromotionResult {
  promoted: Student[]
  retained: Student[]
  transferred: TransferredStudent[]
  pendingECDB: PendingPromotedStudent[]
}

export interface OutstandingBreakdown {
  totalPeriodsSinceAdmission: number
  unpaidPeriods: Array<{
    period: number
    periodName: string
    outstandingAmount: number
  }>
  transportOutstanding: number
  schoolFeesOutstanding: number
  totalOutstanding: number
  transportSkippedMonths: number[]
}

export interface ReportPeriod {
  type: "daily" | "3day" | "weekly" | "monthly" | "termly" | "yearly" | "custom"
  startDate?: string
  endDate?: string
}

export interface StudentReport {
  student: Student
  totalExpected: number
  totalPaid: number
  outstandingAmount: number
  transportOutstanding: number
  schoolFeesOutstanding: number
  paymentHistory: FeePayment[]
  transportHistory: TransportPayment[]
  transportSkippedMonths: string[]
}

export interface ClassGroupReport {
  classGroup: ClassGroup
  studentCount: number
  totalExpected: number
  totalCollected: number
  outstandingAmount: number
  students: StudentReport[]
}

export interface MigrationResult {
  success: boolean
  studentsUpdated: number
  updatedStudents?: Student[]
  errors: string[]
}

export interface TransportService {
  studentId: string
  isActive: boolean
  monthlyFee: number
  startDate: string
  endDate?: string
  waivedPeriods: number[]
  skippedPeriods: number[]
}

export interface ReportConfiguration {
  title: string
  period: ReportPeriod
  includeTransport: boolean
  includeSkippedTransport: boolean
  groupByClass: boolean
  showOutstandingOnly: boolean
  exportFormat: "excel" | "pdf" | "print"
  customFields: string[]
}

export const getCurrentAcademicYear = (): string => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  if (currentMonth >= 1) return currentYear.toString()
  return (currentYear - 1).toString()
}

export const validateStudent = (student: Partial<Student>): string[] => {
  const errors: string[] = []
  if (!student.fullName?.trim()) errors.push("Full name is required")
  if (!student.dateOfBirth) errors.push("Date of birth is required")
  if (!student.parentContact?.trim()) errors.push("Parent contact is required")
  if (!student.address?.trim()) errors.push("Address is required")
  if (!student.admissionDate) errors.push("Admission date is required")
  if (!student.classGroup) errors.push("Class group is required")
  if (!student.className?.trim()) errors.push("Class name is required")
  return errors
}

export const validateAppSettings = (settings: Partial<AppSettings>): string[] => {
  const errors: string[] = []
  if (!settings.schoolName?.trim()) errors.push("School name is required")
  if (!settings.classGroups || settings.classGroups.length === 0) errors.push("At least one class group must be defined")
  if (settings.paymentDueDate && (settings.paymentDueDate < 1 || settings.paymentDueDate > 28)) errors.push("Payment due date must be between 1-28")
  if (settings.transportDueDate && (settings.transportDueDate < 1 || settings.transportDueDate > 28)) errors.push("Transport due date must be between 1-28")
  return errors
}
