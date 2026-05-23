import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import type { Project, CreateProjectInput } from '../types';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createProject: (data: CreateProjectInput) => Promise<Project>;
  updateProject: (id: number, data: Partial<CreateProjectInput>) => Promise<Project>;
  deleteProject: (id: number) => Promise<void>;
  linkWallet: (projectId: number, walletId: number) => Promise<void>;
  unlinkWallet: (projectId: number, walletId: number) => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: CreateProjectInput): Promise<Project> => {
    const newProject = await projectService.create(data);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: number, data: Partial<CreateProjectInput>): Promise<Project> => {
    const updated = await projectService.update(id, data);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    return updated;
  };

  const deleteProject = async (id: number): Promise<void> => {
    await projectService.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const linkWallet = async (projectId: number, walletId: number): Promise<void> => {
    await projectService.linkWallet(projectId, walletId);
    await fetchProjects(); // Refetch to get updated wallet counts
  };

  const unlinkWallet = async (projectId: number, walletId: number): Promise<void> => {
    await projectService.unlinkWallet(projectId, walletId);
    await fetchProjects();
  };

  return { projects, loading, error, refetch: fetchProjects, createProject, updateProject, deleteProject, linkWallet, unlinkWallet };
};