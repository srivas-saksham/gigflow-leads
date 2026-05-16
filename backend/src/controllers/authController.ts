import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) { res.status(400).json({ message: 'All fields are required' }); return; }
    const existing = await User.findOne({ email });
    if (existing) { res.status(409).json({ message: 'Email already in use' }); return; }
    const user = await User.create({ name, email, password, role: 'sales' });
    const token = signToken(user._id.toString(), user.role);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) { res.status(400).json({ message: 'Email and password are required' }); return; }
    const user = await User.findOne({ email });
    if (!user) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const match = await user.comparePassword(password);
    if (!match) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const token = signToken(user._id.toString(), user.role);
    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as any;
    const user = await User.findById(authReq.user.id).select('-password');
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.status(200).json({ user });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const createStaffUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) { res.status(400).json({ message: 'All fields are required' }); return; }
    if (!['admin', 'sales'].includes(role)) { res.status(400).json({ message: 'Invalid role' }); return; }
    const existing = await User.findOne({ email });
    if (existing) { res.status(409).json({ message: 'Email already in use' }); return; }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: (u as any).createdAt,
      })),
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role, password } = req.body;
    if (!['admin', 'sales'].includes(role)) { res.status(400).json({ message: 'Invalid role' }); return; }

    const user = await User.findById(req.params.id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    // check email conflict if changed
    if (email !== user.email) {
      const conflict = await User.findOne({ email });
      if (conflict) { res.status(409).json({ message: 'Email already in use' }); return; }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;
    if (password && password.trim()) user.password = password;

    await user.save();
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as any;
    if (authReq.user.id === req.params.id) {
      res.status(400).json({ message: 'You cannot delete your own account' });
      return;
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    res.status(200).json({ message: 'User deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
};