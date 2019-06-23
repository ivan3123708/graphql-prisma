import jwt from 'jsonwebtoken';

const getUserId = (req) => {
  const authHeader = req.request.headers.authorization;

  if (!authHeader) {
    throw new Error('Authentication required');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = jwt.verify(token, 'mysecret');

  return decoded.userId;
};

export { getUserId as default }; 