import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit, Briefcase, Award, MessageSquare, ShieldAlert,
  Settings, LogOut, Plus, Edit2, Trash2, Check, X, Eye, KeyRound, CheckSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const AdminDashboard = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard navigation tab state
  const [activeTab, setActiveTab] = useState('projects');

  // Loaded database items state
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);

  // Loading state indicators
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Form toggles
  const [showForm, setShowForm] = useState(null); // 'create' or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Form values state
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', longDescription: '', category: 'Web Development',
    technologies: '', liveLink: '', githubLink: '', order: 0, image: '', imageFile: null
  });

  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon: 'Cpu', order: 0
  });

  const [skillForm, setSkillForm] = useState({
    name: '', proficiency: 80, category: 'Frontend', order: 0
  });

  const [experienceForm, setExperienceForm] = useState({
    role: '', company: '', location: '', description: '', 
    startDate: '', endDate: 'Present', type: 'Work', order: 0
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load active tab data
  useEffect(() => {
    if (isAuthenticated) {
      loadTabData();
    }
  }, [activeTab, isAuthenticated]);

  const loadTabData = async () => {
    setIsLoadingItems(true);
    setFeedback({ type: '', text: '' });
    try {
      if (activeTab === 'projects') {
        const res = await api.projects.getAll();
        if (res.success) setProjects(res.data);
      } else if (activeTab === 'services') {
        const res = await api.services.getAll();
        if (res.success) setServices(res.data);
      } else if (activeTab === 'skills') {
        const res = await api.skills.getAll();
        if (res.success) setSkills(res.data);
      } else if (activeTab === 'experience') {
        const res = await api.experience.getAll();
        if (res.success) setExperiences(res.data);
      } else if (activeTab === 'messages') {
        const res = await api.messages.getAll();
        if (res.success) setMessages(res.data);
      }
    } catch (err) {
      showFeedback('error', 'Failed to load data: ' + err.message);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback({ type: '', text: '' });
    }, 5000);
  };

  // Reset forms helper
  const resetFormState = () => {
    setShowForm(null);
    setEditingId(null);
    setProjectForm({
      title: '', description: '', longDescription: '', category: 'Web Development',
      technologies: '', liveLink: '', githubLink: '', order: 0, image: '', imageFile: null
    });
    setServiceForm({ title: '', description: '', icon: 'Cpu', order: 0 });
    setSkillForm({ name: '', proficiency: 80, category: 'Frontend', order: 0 });
    setExperienceForm({
      role: '', company: '', location: '', description: '', 
      startDate: '', endDate: 'Present', type: 'Work', order: 0
    });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Switch tabs helper
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetFormState();
  };

  // Delete handlers
  const handleDelete = async (id, entity) => {
    if (!window.confirm(`Are you sure you want to delete this ${entity}?`)) return;
    try {
      let res;
      if (entity === 'project') res = await api.projects.delete(id);
      else if (entity === 'service') res = await api.services.delete(id);
      else if (entity === 'skill') res = await api.skills.delete(id);
      else if (entity === 'experience') res = await api.experience.delete(id);
      else if (entity === 'message') res = await api.messages.delete(id);

      if (res && res.success) {
        showFeedback('success', `${entity.toUpperCase()} deleted successfully.`);
        loadTabData();
      }
    } catch (err) {
      showFeedback('error', 'Failed to delete: ' + err.message);
    }
  };

  // Edit initialization
  const startEdit = (item, entity) => {
    setEditingId(item._id);
    setShowForm('edit');
    if (entity === 'project') {
      setProjectForm({
        title: item.title,
        description: item.description,
        longDescription: item.longDescription || '',
        category: item.category,
        technologies: item.technologies.join(', '),
        liveLink: item.liveLink || '',
        githubLink: item.githubLink || '',
        order: item.order || 0,
        image: item.image || '',
        imageFile: null
      });
    } else if (entity === 'service') {
      setServiceForm({
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: item.order || 0
      });
    } else if (entity === 'skill') {
      setSkillForm({
        name: item.name,
        proficiency: item.proficiency,
        category: item.category,
        order: item.order || 0
      });
    } else if (entity === 'experience') {
      setExperienceForm({
        role: item.role,
        company: item.company,
        location: item.location || '',
        description: item.description || '',
        startDate: item.startDate,
        endDate: item.endDate,
        type: item.type,
        order: item.order || 0
      });
    }
  };

  // Submit handlers
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', projectForm.title);
    formData.append('description', projectForm.description);
    formData.append('longDescription', projectForm.longDescription);
    formData.append('category', projectForm.category);
    formData.append('technologies', projectForm.technologies);
    formData.append('liveLink', projectForm.liveLink);
    formData.append('githubLink', projectForm.githubLink);
    formData.append('order', projectForm.order);
    
    if (projectForm.imageFile) {
      formData.append('imageFile', projectForm.imageFile);
    } else {
      formData.append('image', projectForm.image);
    }

    try {
      let res;
      if (showForm === 'create') {
        res = await api.projects.create(formData);
      } else {
        res = await api.projects.update(editingId, formData);
      }

      if (res.success) {
        showFeedback('success', `Project ${showForm === 'create' ? 'created' : 'updated'} successfully!`);
        resetFormState();
        loadTabData();
      }
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (showForm === 'create') {
        res = await api.services.create(serviceForm);
      } else {
        res = await api.services.update(editingId, serviceForm);
      }

      if (res.success) {
        showFeedback('success', `Service ${showForm === 'create' ? 'created' : 'updated'} successfully!`);
        resetFormState();
        loadTabData();
      }
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (showForm === 'create') {
        res = await api.skills.create(skillForm);
      } else {
        res = await api.skills.update(editingId, skillForm);
      }

      if (res.success) {
        showFeedback('success', `Skill ${showForm === 'create' ? 'created' : 'updated'} successfully!`);
        resetFormState();
        loadTabData();
      }
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (showForm === 'create') {
        res = await api.experience.create(experienceForm);
      } else {
        res = await api.experience.update(editingId, experienceForm);
      }

      if (res.success) {
        showFeedback('success', `Timeline entry ${showForm === 'create' ? 'created' : 'updated'} successfully!`);
        resetFormState();
        loadTabData();
      }
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback('error', 'New passwords do not match');
      return;
    }

    try {
      const res = await api.auth.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        showFeedback('success', 'Admin password changed successfully.');
        resetFormState();
      }
    } catch (err) {
      showFeedback('error', err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Validating credentials session...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '40px' }} className="hero-grid">
        
        {/* ================= SIDEBAR ================= */}
        <div>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ borderBottom: '1px solid var(--border-dim)', paddingBottom: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>Admin Panel</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MERN Portfolio Manager</p>
            </div>
            
            <button 
              onClick={() => handleTabChange('projects')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'projects' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'projects' ? '#000' : 'var(--text-muted)'
              }}
            >
              <FolderGit size={18} /> Projects
            </button>
            
            <button 
              onClick={() => handleTabChange('services')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'services' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'services' ? '#000' : 'var(--text-muted)'
              }}
            >
              <Settings size={18} /> Services
            </button>
            
            <button 
              onClick={() => handleTabChange('skills')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'skills' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'skills' ? '#000' : 'var(--text-muted)'
              }}
            >
              <Award size={18} /> Skills
            </button>
            
            <button 
              onClick={() => handleTabChange('experience')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'experience' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'experience' ? '#000' : 'var(--text-muted)'
              }}
            >
              <Briefcase size={18} /> Experience
            </button>
            
            <button 
              onClick={() => handleTabChange('messages')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'messages' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'messages' ? '#000' : 'var(--text-muted)'
              }}
            >
              <MessageSquare size={18} /> Messages
            </button>
            
            <button 
              onClick={() => handleTabChange('settings')} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: activeTab === 'settings' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'settings' ? '#000' : 'var(--text-muted)',
                borderBottom: '1px solid var(--border-dim)',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}
            >
              <KeyRound size={18} /> Change Password
            </button>
            
            <button 
              onClick={logout} 
              style={{
                display: 'flex', gap: '10px', alignItems: 'center', width: '100%', padding: '12px 16px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
                background: 'rgba(239, 68, 68, 0.05)',
                color: '#ef4444'
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* ================= CONTENT PANEL ================= */}
        <div>
          {/* Global feedback message box */}
          {feedback.text && (
            <div style={{
              padding: '16px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              background: feedback.type === 'success' ? 'rgba(0, 223, 137, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${feedback.type === 'success' ? 'rgba(0, 223, 137, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              color: feedback.type === 'success' ? 'var(--accent-color)' : '#f87171',
              fontSize: '0.95rem'
            }}>
              {feedback.text}
            </div>
          )}

          {/* ================= TAB: PROJECTS ================= */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem' }}>Manage Projects</h2>
                {!showForm && (
                  <button onClick={() => setShowForm('create')} className="btn btn-primary">
                    <Plus size={16} /> Add Project
                  </button>
                )}
              </div>

              {showForm && (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{showForm === 'create' ? 'New Project' : 'Edit Project'}</h3>
                    <button onClick={resetFormState} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <form onSubmit={handleProjectSubmit}>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Project Title</label>
                        <input type="text" className="form-control" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-control" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})}>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Apps">Mobile Apps</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short Description</label>
                      <input type="text" className="form-control" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Long Description (Markdown / Detailed Overview)</label>
                      <textarea rows="4" className="form-control" value={projectForm.longDescription} onChange={e => setProjectForm({...projectForm, longDescription: e.target.value})}></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Technology tags (separated by commas)</label>
                      <input type="text" className="form-control" placeholder="React, Node.js, Express, MongoDB" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} required />
                    </div>

                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Image File Upload</label>
                        <input type="file" className="form-control" onChange={e => setProjectForm({...projectForm, imageFile: e.target.files[0]})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">OR Image Link (URL)</label>
                        <input type="text" className="form-control" placeholder="https://..." value={projectForm.image} onChange={e => setProjectForm({...projectForm, image: e.target.value, imageFile: null})} />
                      </div>
                    </div>

                    <div className="grid-cols-3">
                      <div className="form-group">
                        <label className="form-label">Live App Link (URL)</label>
                        <input type="text" className="form-control" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">GitHub Link (URL)</label>
                        <input type="text" className="form-control" value={projectForm.githubLink} onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Display Order</label>
                        <input type="number" className="form-control" value={projectForm.order} onChange={e => setProjectForm({...projectForm, order: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button type="button" onClick={resetFormState} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Project</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects Grid List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {projects.map((project) => (
                  <div key={project._id} className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img 
                        src={project.image.startsWith('/uploads/') ? `http://localhost:5000${project.image}` : project.image} 
                        alt="" 
                        style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', background: '#0a0f16' }} 
                      />
                      <div>
                        <h4 style={{ fontSize: '1.1rem' }}>{project.title}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{project.category} • Order: {project.order}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(project, 'project')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(project._id, 'project')} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && !isLoadingItems && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No projects in the database. Seed the database or create a new one.</p>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: SERVICES ================= */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem' }}>Manage Services</h2>
                {!showForm && (
                  <button onClick={() => setShowForm('create')} className="btn btn-primary">
                    <Plus size={16} /> Add Service
                  </button>
                )}
              </div>

              {showForm && (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{showForm === 'create' ? 'New Service' : 'Edit Service'}</h3>
                    <button onClick={resetFormState} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <form onSubmit={handleServiceSubmit}>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Service Title</label>
                        <input type="text" className="form-control" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Lucide Icon name</label>
                        <select className="form-control" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})}>
                          <option value="Cpu">Cpu (Technical / Hardware)</option>
                          <option value="Code">Code (Development / Software)</option>
                          <option value="Users">Users (Client / Support)</option>
                          <option value="Shield">Shield (Security / Protection)</option>
                          <option value="Search">Search (SEO / Analytics)</option>
                          <option value="Layout">Layout (Design / UIUX)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea rows="3" className="form-control" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required></textarea>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Display Order</label>
                      <input type="number" className="form-control" value={serviceForm.order} onChange={e => setServiceForm({...serviceForm, order: e.target.value})} />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button type="button" onClick={resetFormState} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Service</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Services List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {services.map((service) => (
                  <div key={service._id} className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>{service.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Icon: {service.icon} • Order: {service.order}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(service, 'service')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(service._id, 'service')} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: SKILLS ================= */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem' }}>Manage Skills</h2>
                {!showForm && (
                  <button onClick={() => setShowForm('create')} className="btn btn-primary">
                    <Plus size={16} /> Add Skill
                  </button>
                )}
              </div>

              {showForm && (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{showForm === 'create' ? 'New Skill' : 'Edit Skill'}</h3>
                    <button onClick={resetFormState} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <form onSubmit={handleSkillSubmit}>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Skill Name</label>
                        <input type="text" className="form-control" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-control" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database & Tools">Database & Tools</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Proficiency level (0 - 100)%</label>
                        <input type="number" min="0" max="100" className="form-control" value={skillForm.proficiency} onChange={e => setSkillForm({...skillForm, proficiency: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Display Order</label>
                        <input type="number" className="form-control" value={skillForm.order} onChange={e => setSkillForm({...skillForm, order: e.target.value})} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button type="button" onClick={resetFormState} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Skill</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Skills List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {skills.map((skill) => (
                  <div key={skill._id} className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>{skill.name}</h4>
                      <p style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>{skill.proficiency}% • {skill.category}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(skill, 'skill')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(skill._id, 'skill')} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: EXPERIENCE ================= */}
          {activeTab === 'experience' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '2rem' }}>Manage Journey</h2>
                {!showForm && (
                  <button onClick={() => setShowForm('create')} className="btn btn-primary">
                    <Plus size={16} /> Add Entry
                  </button>
                )}
              </div>

              {showForm && (
                <div className="glass-panel" style={{ padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{showForm === 'create' ? 'New Timeline Entry' : 'Edit Timeline Entry'}</h3>
                    <button onClick={resetFormState} style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                  
                  <form onSubmit={handleExperienceSubmit}>
                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Role or Degree Title</label>
                        <input type="text" className="form-control" placeholder="Lead Developer / BS Computer Science" value={experienceForm.role} onChange={e => setExperienceForm({...experienceForm, role: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company / Institution Name</label>
                        <input type="text" className="form-control" placeholder="Tech solutions / University name" value={experienceForm.company} onChange={e => setExperienceForm({...experienceForm, company: e.target.value})} required />
                      </div>
                    </div>

                    <div className="grid-cols-3">
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" placeholder="Colombo, Sri Lanka" value={experienceForm.location} onChange={e => setExperienceForm({...experienceForm, location: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input type="text" className="form-control" placeholder="Oct 2023" value={experienceForm.startDate} onChange={e => setExperienceForm({...experienceForm, startDate: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input type="text" className="form-control" placeholder="Present / Jan 2025" value={experienceForm.endDate} onChange={e => setExperienceForm({...experienceForm, endDate: e.target.value})} />
                      </div>
                    </div>

                    <div className="grid-cols-2">
                      <div className="form-group">
                        <label className="form-label">Entry Type</label>
                        <select className="form-control" value={experienceForm.type} onChange={e => setExperienceForm({...experienceForm, type: e.target.value})}>
                          <option value="Work">Work Experience</option>
                          <option value="Education">Education</option>
                          <option value="Certification">Certification</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Display Order</label>
                        <input type="number" className="form-control" value={experienceForm.order} onChange={e => setExperienceForm({...experienceForm, order: e.target.value})} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Description / Summary of achievements</label>
                      <textarea rows="3" className="form-control" value={experienceForm.description} onChange={e => setExperienceForm({...experienceForm, description: e.target.value})}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                      <button type="button" onClick={resetFormState} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save Entry</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Experience List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {experiences.map((exp) => (
                  <div key={exp._id} className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>{exp.role}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{exp.company} • {exp.startDate} - {exp.endDate} ({exp.type})</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => startEdit(exp, 'experience')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(exp._id, 'experience')} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Inbox Messages</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {messages.map((msg) => (
                  <div key={msg._id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem' }}>{msg.subject || 'Portfolio Inquiry'}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          From: <strong>{msg.name}</strong> (<a href={`mailto:${msg.email}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>{msg.email}</a>)
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                        <button 
                          onClick={() => handleDelete(msg._id, 'message')} 
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: '6px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
                {messages.length === 0 && !isLoadingItems && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Your message inbox is currently empty.</p>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB: SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Security Settings</h2>
              
              <div className="glass-panel" style={{ padding: '35px', borderRadius: '16px', maxWidth: '550px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}><KeyRound size={20} /> Change Admin Password</h3>
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.currentPassword} 
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.newPassword} 
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '28px' }}>
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={passwordForm.confirmPassword} 
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                      required 
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">Change Password</button>
                </form>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
