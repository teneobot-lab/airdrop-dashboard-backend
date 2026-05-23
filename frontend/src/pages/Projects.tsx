import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useWallets } from '../hooks/useWallets';
import { useToast } from '../components/Toast';
import { ProjectCard } from '../components/ProjectCard';
import { Modal } from '../components/Modal';
import { ProjectForm } from '../components/ProjectForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ProjectCardSkeleton } from '../components/Skeleton';
import type { Project, CreateProjectInput, Network, ProjectStatus } from '../types';

export const Projects: React.FC = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject, linkWallet, unlinkWallet } = useProjects();
  const { wallets } = useWallets();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');
  const [filterNetwork, setFilterNetwork] = useState<Network | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [linkWalletModal, setLinkWalletModal] = useState<Project | null>(null);

  // Check for ?new=true query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true') {
      setIsModalOpen(true);
      window.history.replaceState({}, '', '/projects');
    }
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesNetwork = filterNetwork === 'all' || project.network === filterNetwork;
    return matchesSearch && matchesStatus && matchesNetwork;
  });

  const handleSubmit = async (data: CreateProjectInput) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
        showToast('success', 'Project updated successfully');
      } else {
        await createProject(data);
        showToast('success', 'Project added successfully');
      }
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      showToast('error', 'Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setDeleteConfirm({ id, name: project.name });
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteProject(deleteConfirm.id);
        showToast('success', 'Project deleted');
        setDeleteConfirm(null);
      } catch (err) {
        showToast('error', 'Failed to delete project');
      }
    }
  };

  const handleLinkWallet = async (walletId: number) => {
    if (linkWalletModal) {
      try {
        await linkWallet(linkWalletModal.id, walletId);
        showToast('success', 'Wallet linked successfully');
        setLinkWalletModal(null);
      } catch (err) {
        showToast('error', 'Failed to link wallet');
      }
    }
  };

  const handleUnlinkWallet = async (projectId: number, walletId: number) => {
    try {
      await unlinkWallet(projectId, walletId);
      showToast('success', 'Wallet unlinked');
    } catch (err) {
      showToast('error', 'Failed to unlink wallet');
    }
  };

  const linkedWalletIds = linkWalletModal
    ? projects.find(p => p.id === linkWalletModal.id)?.wallets?.map(w => w.id) || []
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} airdrop project{projects.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Project</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="input-field pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="watchlist">Watchlist</option>
          </select>

          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value as Network | 'all')}
            className="input-field w-auto"
          >
            <option value="all">All Networks</option>
            <option value="ETH">ETH</option>
            <option value="BSC">BSC</option>
            <option value="SOL">SOL</option>
            <option value="ARB">ARB</option>
            <option value="OP">OP</option>
            <option value="BASE">BASE</option>
            <option value="OTHER">OTHER</option>
          </select>

          {(searchQuery || filterStatus !== 'all' || filterNetwork !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterNetwork('all'); }}
              className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 50}ms` }}>
              <ProjectCard
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description={searchQuery ? "Try adjusting your search or filters" : "Start tracking your first airdrop project"}
          actionLabel={!searchQuery ? "Add Project" : undefined}
          onAction={!searchQuery ? () => setIsModalOpen(true) : undefined}
          icon={<Plus size={48} />}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        title={editingProject ? 'Edit Project' : 'Add Project'}
        size="lg"
      >
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setIsModalOpen(false); setEditingProject(null); }}
        />
      </Modal>

      {/* Link Wallet Modal */}
      <Modal
        isOpen={!!linkWalletModal}
        onClose={() => setLinkWalletModal(null)}
        title={`Link Wallets to ${linkWalletModal?.name || ''}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Select wallets to link with this project. Linked wallets are eligible for airdrop claims.
          </p>
          {wallets.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {wallets.map((wallet) => {
                const isLinked = linkedWalletIds.includes(wallet.id);
                return (
                  <div
                    key={wallet.id}
                    onClick={() => !isLinked && handleLinkWallet(wallet.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isLinked
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-gray-50 hover:bg-amber-50 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isLinked ? 'bg-emerald-100' : 'bg-gray-200'
                    }`}>
                      {isLinked ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-xs font-bold text-gray-500">
                          {wallet.label?.[0] || 'W'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {wallet.label || 'Unnamed'}
                      </p>
                      <p className="text-xs text-gray-500 font-mono truncate">
                        {wallet.address.slice(0, 16)}...
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${isLinked ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {isLinked ? 'Linked' : 'Click to link'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No wallets available. <a href="/wallets?new=true" className="text-amber-600">Add a wallet first</a>
            </p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />

      {/* FAB for mobile */}
      <button
        onClick={() => { setEditingProject(null); setIsModalOpen(true); }}
        className="fixed bottom-24 right-6 md:hidden w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};