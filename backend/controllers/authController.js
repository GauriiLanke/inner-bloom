const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAuthToken } = require('../services/tokenService');

async function register(req, res) {
  const { name, email, password, age } = req.body || {};
  if (!name || !email || !password || !age) {
    return res.status(400).json({ message: 'name, email, password, age are required' });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    passwordHash,
    age: Number(age),
  });

  const token = signAuthToken(user);
  return res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, age: user.age },
  });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signAuthToken(user);
  return res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, age: user.age },
  });
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select('_id name email age');
  return res.json({ user });
}

module.exports = { register, login, me };

