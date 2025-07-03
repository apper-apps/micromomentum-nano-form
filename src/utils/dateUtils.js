import { format, formatDistanceToNow, isToday, isYesterday, startOfWeek, endOfWeek } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatRelativeTime = (date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const getWeekRange = (date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  };
};

export const isWithinWeek = (date, referenceDate = new Date()) => {
  const { start, end } = getWeekRange(referenceDate);
  const checkDate = new Date(date);
  return checkDate >= start && checkDate <= end;
};