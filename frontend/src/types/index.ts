export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  source: 'website' | 'instagram' | 'referral';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sortBy: 'latest' | 'oldest';
  page: number;
}