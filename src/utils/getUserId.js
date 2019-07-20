import jwt from 'jsonwebtoken';

const getUserId = (req, requireAuth = true) => {
  const authHeader = req.request ? req.request.headers.authorization : req.connection.context.Authorization;

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error('Authentication required');
  }

  return null;
};

export { getUserId as default };