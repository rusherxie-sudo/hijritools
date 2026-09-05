function gradeToPoints(grade, scale) {
  const p = Math.max(0, Math.min(100, grade));
  if (scale === 5) {
    if (p >= 95) return 5.0;
    if (p >= 90) return 4.75;
    if (p >= 85) return 4.0;
    if (p >= 80) return 3.0;
    if (p >= 75) return 2.0;
    if (p >= 70) return 1.5;
    if (p >= 65) return 1.0;
    if (p >= 60) return 0;
    return 0;
  }
  if (p >= 95) return 4.0;
  if (p >= 90) return 3.75;
  if (p >= 85) return 3.0;
  if (p >= 80) return 2.5;
  if (p >= 75) return 2.0;
  if (p >= 70) return 1.5;
  if (p >= 65) return 1.0;
  if (p >= 60) return 0;
  return 0;
}

export function calculateGPA(courses, scale = 4) {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const c of courses) {
    const credits = Math.max(0, c.credits || 0);
    const points = gradeToPoints(c.grade, scale);
    totalPoints += points * credits;
    totalCredits += credits;
  }

  const gpa = totalCredits === 0 ? 0 : totalPoints / totalCredits;
  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    totalPoints: Math.round(totalPoints * 100) / 100,
  };
}

export function gpaToPercentage(gpa, scale = 4) {
  if (scale === 5) {
    const p = Math.round(((gpa - 1) / 4) * 40 + 60);
    return Math.max(0, Math.min(100, p));
  }
  if (gpa >= 4.0) return 100;
  if (gpa >= 3.75) return 95;
  if (gpa >= 3.5) return 90;
  if (gpa >= 3.0) return 85;
  if (gpa >= 2.5) return 80;
  if (gpa >= 2.0) return 75;
  if (gpa >= 1.5) return 70;
  if (gpa >= 1.0) return 65;
  return 60;
}

export function percentageToGpa(percent, scale = 4) {
  const p = Math.max(0, Math.min(100, percent));
  if (scale === 5) return Math.round(((p - 60) / 40) * 4 + 1);
  if (p >= 95) return 4.0;
  if (p >= 90) return 3.75;
  if (p >= 85) return 3.0;
  if (p >= 80) return 2.5;
  if (p >= 75) return 2.0;
  if (p >= 70) return 1.5;
  if (p >= 65) return 1.0;
  return 0;
}

export function letterGrade(gpa, scale = 4) {
  if (scale === 5) {
    if (gpa >= 4.5) return 'ممتاز +A';
    if (gpa >= 3.75) return 'جيد جدًا +B';
    if (gpa >= 2.75) return 'جيد +C';
    if (gpa >= 2.0) return 'مقبول +D';
  }
  if (gpa >= 3.75) return 'ممتاز +A';
  if (gpa >= 3.5) return 'ممتاز A';
  if (gpa >= 3.0) return 'جيد جدًا +B';
  if (gpa >= 2.5) return 'جيد +C';
  if (gpa >= 2.0) return 'مقبول C';
  if (gpa >= 1.0) return 'راسب D';
  return 'راسب F';
}
