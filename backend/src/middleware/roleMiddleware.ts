import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

export const staffOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'sales') {
    res.status(403).json({ message: 'Staff access required' });
    return;
  }
  next();
};