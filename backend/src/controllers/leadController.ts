import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../types/index';

// Helper: escape a CSV cell value (RFC 4180)
const csvCell = (value: string): string => {
  const str = String(value ?? '');
  // If the value contains a comma, double-quote, or newline, wrap in quotes and escape inner quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Build a shared filter object from query params — reused by getLeads and exportCSV
const buildFilter = (query: Record<string, string>) => {
  const { status, source, search } = query;
  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    next(err);
  }
};

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sortBy,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const filter = buildFilter({ status, source, search });
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
    next(err);
  }
};

export const getLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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
    next(err);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

export const exportCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Respect active filters so export matches what the user sees
    const { status, source, search } = req.query as Record<string, string>;
    const filter = buildFilter({ status, source, search });

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map((l) => [
      csvCell(l.name),
      csvCell(l.email),
      csvCell(l.status),
      csvCell(l.source),
      csvCell(new Date(l.createdAt as Date).toLocaleDateString('en-GB')),
    ]);

    const csv = [headers.map(csvCell), ...rows].map((r) => r.join(',')).join('\n');
    const csvBuffer = Buffer.from(csv, 'utf-8');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.setHeader('Content-Length', csvBuffer.length);
    res.status(200).send(csvBuffer);
  } catch (err) {
    next(err);
  }
};

// Public endpoint — no auth, leads come from the homepage contact form
export const submitLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    // System-level sentinel ObjectId for public leads (no authenticated user)
    const { Types } = await import('mongoose');
    const systemId = new Types.ObjectId('000000000000000000000000');

    const lead = await Lead.create({
      name,
      email,
      status: 'new',
      source: 'website',
      createdBy: systemId,
      ...(message && { notes: message }),
    });

    res.status(201).json({ message: 'Thanks! We will be in touch soon.', lead });
  } catch (err) {
    next(err);
  }
};