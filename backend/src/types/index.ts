import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'sales';
  };
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sortBy?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}