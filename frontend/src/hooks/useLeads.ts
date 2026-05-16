import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import type { Lead, Pagination, LeadFilters } from '../types';

export const useLeads = (filters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.source) params.append('source', filters.source);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        params.append('page', filters.page.toString());
        params.append('limit', '10');

        const res = await api.get(`/api/leads?${params.toString()}`);
        setLeads(res.data.leads);
        setPagination(res.data.pagination);
    } catch (err) {
        setError('Failed to fetch leads');
    } finally {
        setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, pagination, loading, error, refetch: fetchLeads };
};