import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/index';

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: 'admin' | 'sales' | 'customer';
    };

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};