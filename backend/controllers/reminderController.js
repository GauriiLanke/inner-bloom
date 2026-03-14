const Reminder = require('../models/Reminder');

function normalizeTime(t) {
  const s = String(t || '').trim();
  if (!/^\d{2}:\d{2}$/.test(s)) return null;
  const [hh, mm] = s.split(':').map((x) => Number(x));
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

async function upsertMany(req, res) {
  const items = req.body?.reminders;
  if (!Array.isArray(items)) return res.status(400).json({ message: 'reminders array is required' });

  // Allow three primary meal reminders plus optional extras.
  const allowedTypes = new Set(['Breakfast', 'Lunch', 'Dinner', 'Exercise', 'Water Intake', 'Sleep']);

  const results = [];
  for (const it of items) {
    const type = String(it?.type || '').trim();
    const time = normalizeTime(it?.time);
    const enabled = it?.enabled !== false;
    if (!allowedTypes.has(type) || !time) continue;

    const doc = await Reminder.findOneAndUpdate(
      { userId: req.user.id, type },
      { $set: { time, enabled } },
      { upsert: true, new: true },
    );
    results.push(doc);
  }

  return res.json({ reminders: results });
}

async function list(req, res) {
  const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: 1 });
  return res.json({ reminders });
}

module.exports = { upsertMany, list };

