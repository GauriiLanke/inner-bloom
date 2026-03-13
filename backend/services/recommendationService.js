function buildRecommendations(riskLevel) {
  const base = {
    lifestyle: [
      'Prioritize balanced meals with protein + fiber to support stable energy.',
      'Track your cycle and symptoms weekly to spot patterns early.',
      'Aim for daily sunlight + gentle movement to support mood and hormones.',
    ],
    exercise: [
      'Start with 20–30 minutes of brisk walking 5 days/week.',
      'Add 2 strength sessions/week (bodyweight is fine).',
      'Stretch 5 minutes after workouts to reduce stress.',
    ],
    sleep: [
      'Target 7–9 hours of sleep with a consistent bedtime.',
      'Limit screen time 60 minutes before bed.',
      'Try 3 minutes of breathing (4-7-8) to wind down.',
    ],
    doctor: [
      'If symptoms persist, consider consulting a gynecologist/endocrinologist.',
      'Ask about hormone profile, ultrasound, and metabolic screening if recommended.',
    ],
  };

  if (riskLevel === 'Low') {
    return {
      ...base,
      headline: 'You’re currently in a lower-risk zone. Focus on consistency.',
      nextSteps: ['Keep up healthy routines', 'Reassess monthly or if symptoms change'],
    };
  }

  if (riskLevel === 'Moderate') {
    return {
      ...base,
      headline: 'Moderate risk signals detected. Small changes can make a big difference.',
      lifestyle: [
        'Reduce sugary drinks and ultra-processed snacks to support insulin balance.',
        ...base.lifestyle,
      ],
      exercise: ['Try 10 minutes after meals (walk) to support glucose control.', ...base.exercise],
      nextSteps: ['Follow the plan for 2–4 weeks', 'Consider a clinician consult if symptoms persist'],
    };
  }

  return {
    ...base,
    headline: 'Higher risk signals detected. A clinical check-up is recommended.',
    lifestyle: [
      'Focus on low-GI meals: veggies + protein + healthy fats.',
      'Keep a symptom journal to share with a clinician.',
      ...base.lifestyle,
    ],
    exercise: [
      'Start gently: 15–20 minutes daily, add strength 2x/week as tolerated.',
      ...base.exercise,
    ],
    doctor: [
      'Book a gynecologist/endocrinologist consultation soon.',
      ...base.doctor,
    ],
    nextSteps: ['Consult a clinician', 'Use reminders to stay consistent day-to-day'],
  };
}

module.exports = { buildRecommendations };

