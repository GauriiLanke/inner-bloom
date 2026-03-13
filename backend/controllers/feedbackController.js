const Feedback = require('../models/Feedback');

async function submit(req, res) {
  const { rating, comment = '', tags = [] } = req.body || {};
  const r = Number(rating);
  if (!r || r < 1 || r > 5) return res.status(400).json({ message: 'rating must be 1-5' });

  const doc = await Feedback.create({
    userId: req.user.id,
    rating: r,
    comment: String(comment || '').slice(0, 2000),
    tags: Array.isArray(tags) ? tags.map((t) => String(t).slice(0, 40)) : [],
  });

  return res.status(201).json({ feedbackId: doc._id });
}

async function listMine(req, res) {
  const items = await Feedback.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  return res.json({ feedback: items });
}

async function analytics(req, res) {
  const agg = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        r1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        r2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        r3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        r4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        r5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
      },
    },
    { $project: { _id: 0 } },
  ]);

  const topTags = await Feedback.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
    { $project: { _id: 0, tag: '$_id', count: 1 } },
  ]);

  return res.json({
    summary: agg[0] || { count: 0, avgRating: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 },
    topTags,
  });
}

module.exports = { submit, listMine, analytics };

