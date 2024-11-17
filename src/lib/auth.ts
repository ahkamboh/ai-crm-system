import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(403).json({ message: 'Token is required' });
    return false;
  }

  try {
    const decoded = jwt.verify(token, 'crm-system');
    (req as any).user = decoded; // Store the decoded token in the request
    return true;
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
    return false;
  }
};
