// 备考计划表生成器（جدول مذاكرة）。纯函数，DOM 无关。
// 输入：考试日期、当前日期、科目 → 生成周/日备考计划表。

function parseDate(s) {
  if (s instanceof Date) return s;
  return new Date(s);
}

function daysBetween(d1, d2) {
  const ms = Math.abs(parseDate(d2) - parseDate(d1));
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function daysUntilExam(examDate, today = new Date()) {
  const ms = parseDate(examDate) - parseDate(today);
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function weeksUntilExam(examDate, today = new Date()) {
  return Math.max(0, Math.ceil(daysUntilExam(examDate, today) / 7));
}

export function generateStudyPlan(examDate, subjects = [], hoursPerDay = 3, today = new Date()) {
  const days = daysUntilExam(examDate, today);
  const weeks = Math.max(1, Math.ceil(days / 7));
  const totalHours = days * hoursPerDay;

  if (subjects.length === 0) {
    return { days, weeks, totalHours, weeklyPlan: [], dailyPlan: [] };
  }

  const hoursPerSubject = totalHours / subjects.length;

  const weeklyPlan = [];
  for (let w = 1; w <= weeks; w++) {
    const phase = w <= Math.ceil(weeks * 0.4) ? 'review' : w <= Math.ceil(weeks * 0.8) ? 'practice' : 'review-final';
    const weekSubjects = subjects.map((s, i) => ({
      subject: s,
      hours: Math.round((hoursPerSubject / weeks) * 10) / 10,
      focus: phase === 'review' ? 'مراجعة المفاهيم' : phase === 'practice' ? 'تمارين واختبارات' : 'مراجعة نهائية',
    }));
    weeklyPlan.push({ week: w, phase, subjects: weekSubjects });
  }

  const dailyPlan = [];
  for (let d = 1; d <= Math.min(7, days); d++) {
    const daySubjects = subjects.map((s, i) => ({
      subject: s,
      minutes: Math.round((hoursPerDay * 60) / subjects.length),
    }));
    dailyPlan.push({ day: d, subjects: daySubjects });
  }

  return {
    days,
    weeks,
    totalHours: Math.round(totalHours * 10) / 10,
    hoursPerSubject: Math.round(hoursPerSubject * 10) / 10,
    weeklyPlan,
    dailyPlan,
  };
}

export const QDRAT_SUBJECTS = [
  'اللفظي (اللغة العربية)',
  'الكمي (الرياضيات)',
  'الاستدلال المنطقي',
  'الاستدلال الهندسي',
];

export const TAHSELI_SUBJECTS = [
  'الرياضيات',
  'الفيزياء',
  'الكيمياء',
  'الأحياء',
  'اللغة الإنجليزية',
];
