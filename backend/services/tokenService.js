const jwt = require('jsonwebtoken');

function signAuthToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');

  return jwt.sign(
    { email: user.email },
    secret,
    {
      subject: String(user._id),
      expiresIn: '7d',
    },
  );
}

module.exports = { signAuthToken };

