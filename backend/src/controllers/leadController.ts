import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../types/index';

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({ message: 'Name, email and source are required' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || 'new',
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({ lead });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sortBy,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = sortBy === 'oldest' ? 1 : -1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sort }).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ lead });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.status(200).json({ lead });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const leads = await Lead.find({});

    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.status,
      l.source,
      new Date(l.createdAt as Date).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};