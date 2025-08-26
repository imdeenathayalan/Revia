// src/utils/debtTypes.js
export const DEBT_TYPES = {
  PERSONAL_LOAN: 'personal_loan',
  HOME_LOAN: 'home_loan',
  CAR_LOAN: 'car_loan',
  EDUCATION_LOAN: 'education_loan',
  CREDIT_CARD: 'credit_card',
  OTHER: 'other'
};

export const DEBT_TYPE_LABELS = {
  [DEBT_TYPES.PERSONAL_LOAN]: 'Personal Loan',
  [DEBT_TYPES.HOME_LOAN]: 'Home Loan',
  [DEBT_TYPES.CAR_LOAN]: 'Car Loan',
  [DEBT_TYPES.EDUCATION_LOAN]: 'Education Loan',
  [DEBT_TYPES.CREDIT_CARD]: 'Credit Card',
  [DEBT_TYPES.OTHER]: 'Other Debt'
};

export const DEBT_TYPE_ICONS = {
  [DEBT_TYPES.PERSONAL_LOAN]: 'bi-cash',
  [DEBT_TYPES.HOME_LOAN]: 'bi-house',
  [DEBT_TYPES.CAR_LOAN]: 'bi-car',
  [DEBT_TYPES.EDUCATION_LOAN]: 'bi-book',
  [DEBT_TYPES.CREDIT_CARD]: 'bi-credit-card',
  [DEBT_TYPES.OTHER]: 'bi-wallet'
};