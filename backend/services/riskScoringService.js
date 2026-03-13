function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function scoreAssessment(input) {
  const explanation = [];
  let score = 0;

  // Menstrual regularity (strong signal)
  const reg = String(input?.menstrual?.cycleRegularity || '').toLowerCase();
  if (reg.includes('regular')) score += 0;
  else if (reg.includes('irregular')) {
    score += 25;
    explanation.push('Irregular menstrual cycles can be an early PCOS indicator.');
  } else if (reg.includes('absent')) {
    score += 35;
    explanation.push('Absent periods may indicate hormonal imbalance and needs evaluation.');
  } else if (reg.includes('very')) {
    score += 30;
    explanation.push('Very irregular cycles are associated with increased PCOS risk.');
  }

  // Cycle duration
  const dur = Number(input?.menstrual?.cycleDurationDays);
  if (!Number.isNaN(dur)) {
    if (dur < 21 || dur > 35) {
      score += 10;
      explanation.push('Cycle length outside 21–35 days can suggest irregular ovulation.');
    }
  }

  // Symptoms
  const s = input?.symptoms || {};
  const symptomPoints = [
    ['acne', 8, 'Persistent acne can be linked to androgen imbalance.'],
    ['hairLoss', 10, 'Hair thinning can be linked to androgen imbalance.'],
    ['weightGain', 12, 'Weight gain can be associated with insulin resistance.'],
    ['fatigue', 6, 'Fatigue can occur with metabolic or hormonal changes.'],
  ];
  for (const [key, pts, msg] of symptomPoints) {
    if (s[key]) {
      score += pts;
      explanation.push(msg);
    }
  }

  // Lifestyle
  const sleep = Number(input?.lifestyle?.sleepHours);
  if (!Number.isNaN(sleep) && sleep < 7) {
    score += 6;
    explanation.push('Less than 7 hours of sleep can affect hormones and metabolism.');
  }
  const stress = String(input?.lifestyle?.stressLevel || '').toLowerCase();
  if (stress === 'high') {
    score += 8;
    explanation.push('High stress can worsen hormonal imbalance.');
  } else if (stress === 'medium') {
    score += 4;
  }
  const ex = String(input?.lifestyle?.exerciseFrequency || '').toLowerCase();
  if (ex.includes('never')) score += 8;
  else if (ex.includes('1') || ex.includes('2')) score += 4;

  // Family history
  const fh = String(input?.familyHistory?.pcosHistory || '').toLowerCase();
  if (fh === 'yes') {
    score += 10;
    explanation.push('Family history can increase likelihood of PCOS.');
  } else if (fh.includes('not')) {
    score += 3;
  }

  score = clamp(score, 0, 100);

  let riskLevel = 'Low';
  if (score >= 65) riskLevel = 'High';
  else if (score >= 35) riskLevel = 'Moderate';

  // Ensure at least one friendly line
  if (explanation.length === 0) {
    explanation.push('Your inputs show fewer typical PCOS indicators right now.');
  }

  return { score, riskLevel, explanation };
}

module.exports = { scoreAssessment };

