export const colors = {
  bg: '#F2F5F7',
  surface: '#FFFFFF',
  ink: '#14213D',
  muted: '#5B6B80',
  line: '#D9E0E7',
  primary: '#0F766E',
  onPrimary: '#FFFFFF',
  cancelled: '#B42318',
  rescheduled: '#B7791F',
};
export const statusColor = (s) =>
  s === 'CANCELLED' ? colors.cancelled : s === 'RESCHEDULED' ? colors.rescheduled : colors.primary;
export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
