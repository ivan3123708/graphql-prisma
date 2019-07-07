import jwt from 'jsonwebtoken';

const getUserId = (req, requireAuth = true) => {
  const authHeader = req.request.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mysecret');

    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

export { getUserId as default };