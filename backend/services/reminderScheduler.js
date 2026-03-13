const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { sendMail } = require('./mailService');

function pad2(n) {
  return String(n).padStart(2, '0');
}

function nowKey(d = new Date()) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return { dayKey: `${y}-${m}-${day}`, timeKey: `${hh}:${mm}` };
}

async function tick() {
  const { dayKey, timeKey } = nowKey(new Date());

  const due = await Reminder.find({
    enabled: true,
    time: timeKey,
    $or: [{ lastSentDay: { $ne: dayKey } }, { lastSentDay: { $exists: false } }],
  }).limit(200);

  if (due.length === 0) return;

  const userIds = [...new Set(due.map((r) => String(r.userId)))];
  const users = await User.find({ _id: { $in: userIds } }).select('_id email name');
  const byId = new Map(users.map((u) => [String(u._id), u]));

  for (const r of due) {
    const u = byId.get(String(r.userId));
    if (!u?.email) continue;

    const subject = `Inner Bloom Reminder: ${r.type}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial; line-height:1.4">
        <h2 style="margin:0 0 8px;color:#6d28d9">Inner Bloom</h2>
        <p style="margin:0 0 12px">Hi ${u.name || 'there'}, this is your reminder for <b>${r.type}</b>.</p>
        <p style="margin:0;color:#6b7280">Stay consistent — small habits compound into big results.</p>
      </div>
    `;

    await sendMail({ to: u.email, subject, html });

    r.lastSentAt = new Date();
    r.lastSentDay = dayKey;
    await r.save();
  }
}

function startReminderScheduler() {
  // Every minute
  cron.schedule('* * * * *', () => {
    tick().catch((err) => console.error('Reminder tick failed', err));
  });
}

module.exports = { startReminderScheduler };

