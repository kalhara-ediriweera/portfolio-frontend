import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, Users, Shield, Search, Layout, Code, 
  ExternalLink, Github, Send, Briefcase, 
  GraduationCap, Calendar, MapPin, CheckCircle, ArrowRight
} from 'lucide-react';
import api from '../api';

// Icon Map helper to render Lucide Icons dynamically based on string
const IconMap = {
  Cpu: Cpu,
  Users: Users,
  Shield: Shield,
  Search: Search,
  Layout: Layout,
  Code: Code
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Cpu;
  return <IconComponent className={className} />;
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  
  // States for interactive functions
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [projRes, servRes, skillRes, expRes] = await Promise.all([
          api.projects.getAll(),
          api.services.getAll(),
          api.skills.getAll(),
          api.experience.getAll()
        ]);

        if (projRes.success) setProjects(projRes.data);
        if (servRes.success) setServices(servRes.data);
        if (skillRes.success) setSkills(skillRes.data);
        if (expRes.success) setExperiences(expRes.data);
      } catch (err) {
        console.error('Failed to load portfolio database content:', err);
      }
    };
    fetchPortfolioData();
  }, []);

  // Filter project lists
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  // Form submission
  const handleInputChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const res = await api.messages.send(contactForm);
      if (res.success) {
        setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({ type: 'error', message: res.error || 'Failed to send message.' });
      }
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Background Decorative Blobs */}
      <div className="glow-orb orb-primary" style={{ top: '-10%', left: '-10%' }}></div>
      <div className="glow-orb orb-secondary" style={{ top: '35%', right: '-15%' }}></div>
      <div className="glow-orb orb-primary" style={{ bottom: '15%', left: '-15%' }}></div>

      {/* ================= HERO SECTION ================= */}
      <section className="sectionHero container" id="home" style={{ paddingTop: '160px', paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }} className="hero-grid">
          <div>
            <span className="tag" style={{ marginBottom: '16px', display: 'inline-block' }}>Leading Edge Portfolio</span>
            <h1 style={{ fontSize: '3.8rem', lineHeight: '1.1', marginBottom: '24px', fontWeight: '800' }}>
              We Bring <span className="text-gradient" style={{ color: 'var(--accent-color)', WebkitTextFillColor: 'unset', background: 'unset' }}>Cutting Edge</span> Digital Solutions.
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '32px', maxWidth: '600px' }}>
              Transforming creative conceptual workflows into secure, high-performance web applications. Empowering digital presence with state-of-the-art software systems.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#contact" className="btn btn-primary">Start Your Project <ArrowRight size={18} /></a>
              <a href="#projects" className="btn btn-secondary">Explore Showcase</a>
            </div>
          </div>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Visual Decorative Frame */}
            <div className="glass-panel animate-float" style={{ 
              padding: '24px', 
              width: '100%', 
              maxWidth: '400px',
              borderRadius: '24px',
              position: 'relative',
              zIndex: 2,
              border: '1px solid rgba(0, 223, 137, 0.2)'
            }}>
              <div style={{ background: '#0a0f16', borderRadius: '16px', overflow: 'hidden', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={120} className="animate-spin-slow" style={{ color: 'var(--accent-color)', opacity: 0.8 }} />
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Creative Architecture</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your Business Needs Modern Solutions</p>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-color)', boxShadow: '0 0 10px var(--accent-color)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BRAND LOGOS BANNER ================= */}
      <section className="section" style={{ padding: '40px 0', borderTop: '1px solid var(--border-dim)', borderBottom: '1px solid var(--border-dim)', background: 'rgba(10, 16, 25, 0.5)' }}>
        <div className="container" style={{ overflow: 'hidden' }}>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
            Fueling success stories with top-tier technology components
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '30px', opacity: 0.6 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>M O N G O D B</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>E X P R E S S</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>R E A C T</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>N O D E J S</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', letterSpacing: '0.05em', color: 'white' }}>V I T E</span>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="section" id="services">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="tag">Our Expertise</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '12px' }} className="text-gradient">Digital Solutions for Innovation & Growth</h2>
          </div>
          
          <div className="grid-cols-3">
            {services.map((service) => (
              <div key={service._id} className="glass-panel" style={{ padding: '35px 30px', borderRadius: '16px' }}>
                <div style={{ 
                  background: 'rgba(0, 223, 137, 0.08)', 
                  border: '1px solid rgba(0, 223, 137, 0.2)',
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '24px'
                }}>
                  <DynamicIcon name={service.icon} className="icon-teal" style={{ color: 'var(--accent-color)', width: '28px', height: '28px' }} />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '14px', fontWeight: '600' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{service.description}</p>
              </div>
            ))}
            {services.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                No services added yet. Launch the Admin dashboard to add services.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= DECORATIVE PROMO TRANSFORMATION SECTION ================= */}
      <section className="section" style={{ background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)' }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
          <div>
            <span className="tag">Transformative Core</span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '12px', marginBottom: '20px' }}>Transformative Digital Solutions For Growth And Innovation</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              Building applications is not just about code. It is about understanding critical client targets, implementing robust designs, delivering end-to-end optimizations, and providing support channels that yield tangible outcomes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <CheckCircle size={20} style={{ color: 'var(--accent-color)' }} />
                <span>Ideate. Develop. Launch. Grow.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <CheckCircle size={20} style={{ color: 'var(--accent-color)' }} />
                <span>Think Smart. Build Fast. Scale Strong.</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 75%)', opacity: 0.15 }}></div>
            <div className="glass-panel" style={{ 
              borderRadius: '50%', 
              width: '320px', 
              height: '320px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px solid rgba(0, 223, 137, 0.2)',
              boxShadow: 'inset 0 0 40px rgba(0, 223, 137, 0.1)',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', width: '90%', height: '90%', border: '1px dashed rgba(255, 255, 255, 0.15)', borderRadius: '50%' }} className="animate-spin-slow"></div>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px var(--accent-color)' }}>
                <Cpu size={40} style={{ color: '#000' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROJECTS SHOWCASE ================= */}
      <section className="section" id="projects">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }} className="portfolio-header">
            <div>
              <span className="tag">Creative Portfolio</span>
              <h2 style={{ fontSize: '2.5rem', marginTop: '12px' }} className="text-gradient">Featured Work & Projects</h2>
            </div>
            
            {/* Category tabs */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-dim)', padding: '6px', borderRadius: '99px' }} className="tab-container">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '99px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: selectedCategory === cat ? 'var(--accent-color)' : 'transparent',
                    color: selectedCategory === cat ? '#000' : 'var(--text-muted)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-cols-2">
            {filteredProjects.map((project) => (
              <div 
                key={project._id} 
                className="glass-panel" 
                onClick={() => setSelectedProject(project)}
                style={{ 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={project.image.startsWith('/uploads/') ? `http://localhost:5000${project.image}` : project.image} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
                    className="project-img"
                  />
                  <div style={{ 
                    position: 'absolute', 
                    top: '16px', 
                    left: '16px', 
                    background: 'rgba(0, 0, 0, 0.65)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--accent-color)', 
                    padding: '4px 12px', 
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {project.category}
                  </div>
                </div>
                
                <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                      {project.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.technologies.slice(0, 4).map((tech, idx) => (
                      <span key={idx} style={{ 
                        fontSize: '0.7rem', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border-dim)', 
                        padding: '4px 10px', 
                        borderRadius: '4px',
                        color: 'var(--text-muted)'
                      }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span style={{ fontSize: '0.7rem', padding: '4px 10px', color: 'var(--accent-color)' }}>
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '50px' }}>
                No projects found in this category.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= SKILLS & PROFESSIONAL JOURNEY ================= */}
      <section className="section" id="skills-experience" style={{ borderTop: '1px solid var(--border-dim)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="hero-grid">
            
            {/* Skills Progress Columns */}
            <div>
              <span className="tag">Tech Stack</span>
              <h2 style={{ fontSize: '2.3rem', marginTop: '12px', marginBottom: '36px' }} className="text-gradient">Professional Skills</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {skills.map((skill) => (
                  <div key={skill._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{skill.name}</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>{skill.proficiency}%</span>
                    </div>
                    {/* Progress Track */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${skill.proficiency}%`, 
                        height: '100%', 
                        background: 'linear-gradient(90deg, var(--accent-color), var(--accent-secondary))',
                        borderRadius: '99px',
                        boxShadow: '0 0 10px var(--accent-color)'
                      }}></div>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <p style={{ color: 'var(--text-muted)' }}>No skills found. Manage skills in Admin panel.</p>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <span className="tag">Timeline</span>
              <h2 style={{ fontSize: '2.3rem', marginTop: '12px', marginBottom: '36px' }} className="text-gradient">Work & Education</h2>
              
              <div style={{ position: 'relative', borderLeft: '2px solid var(--border-dim)', paddingLeft: '30px', marginLeft: '10px' }}>
                {experiences.map((exp, idx) => (
                  <div key={exp._id} style={{ position: 'relative', marginBottom: '40px' }}>
                    {/* Marker Bullet */}
                    <div style={{ 
                      position: 'absolute', 
                      left: '-41px', 
                      top: '0px', 
                      width: '20px', 
                      height: '20px', 
                      borderRadius: '50%', 
                      background: exp.type === 'Work' ? 'var(--accent-color)' : 'var(--accent-secondary)',
                      border: '4px solid var(--bg-primary)',
                      boxShadow: '0 0 10px rgba(0,223,137,0.3)'
                    }}></div>
                    
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                        {exp.type === 'Work' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                        <span>{exp.type.toUpperCase()}</span>
                        <span style={{ color: 'var(--text-dark)' }}>|</span>
                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-muted)' }}>{exp.startDate} - {exp.endDate}</span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{exp.role}</h3>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
                        {exp.company} {exp.location && <><span style={{ color: 'var(--text-dark)' }}>•</span> <MapPin size={13} /> {exp.location}</>}
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{exp.description}</p>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <p style={{ color: 'var(--text-muted)' }}>No experiences or education timeline items added yet.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM ================= */}
      <section className="section" id="contact" style={{ borderTop: '1px solid var(--border-dim)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="tag">Get In Touch</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '12px' }} className="text-gradient">Let's Create Something Great</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
              Have an idea, project, or want to say hello? Drop a message. Free consultation call: <strong>+94 702 167 589</strong>
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="hero-grid">
                <div className="form-group">
                  <label className="form-label">Full Name <span style={{ color: 'var(--accent-color)' }}>*</span></label>
                  <input 
                    type="text" 
                    name="name" 
                    value={contactForm.name} 
                    onChange={handleInputChange} 
                    className="form-control" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address <span style={{ color: 'var(--accent-color)' }}>*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    value={contactForm.email} 
                    onChange={handleInputChange} 
                    className="form-control" 
                    placeholder="Enter your email" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={contactForm.subject} 
                  onChange={handleInputChange} 
                  className="form-control" 
                  placeholder="What is this regarding?" 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label className="form-label">Your Message <span style={{ color: 'var(--accent-color)' }}>*</span></label>
                <textarea 
                  name="message" 
                  value={contactForm.message} 
                  onChange={handleInputChange} 
                  rows="5" 
                  className="form-control" 
                  placeholder="Tell me more about your goals..." 
                  required 
                ></textarea>
              </div>

              {formStatus.message && (
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  background: formStatus.type === 'success' ? 'rgba(0, 223, 137, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${formStatus.type === 'success' ? 'rgba(0, 223, 137, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  color: formStatus.type === 'success' ? 'var(--accent-color)' : '#f87171',
                  fontSize: '0.9rem'
                }}>
                  {formStatus.message}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending inquiry...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= PROJECT DETAIL MODAL ================= */}
      {selectedProject && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'rgba(5, 8, 15, 0.85)', 
          backdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 999,
          padding: '20px'
        }} onClick={() => setSelectedProject(null)}>
          <div className="glass-panel" style={{ 
            maxWidth: '750px', 
            width: '100%', 
            borderRadius: '24px', 
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            animation: 'float 4s ease-in-out infinite' // Or simple fade
          }} onClick={(e) => e.stopPropagation()}>
            {/* Hero image */}
            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={selectedProject.image.startsWith('/uploads/') ? `http://localhost:5000${selectedProject.image}` : selectedProject.image} 
                alt={selectedProject.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button 
                onClick={() => setSelectedProject(null)}
                style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  border: 'none',
                  background: 'rgba(0, 0, 0, 0.7)', 
                  color: 'white', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Scrollable details */}
            <div style={{ padding: '35px', overflowY: 'auto', flexGrow: 1 }}>
              <span className="tag" style={{ marginBottom: '12px', display: 'inline-block' }}>{selectedProject.category}</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>{selectedProject.title}</h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {selectedProject.technologies.map((tech, idx) => (
                  <span key={idx} style={{ 
                    fontSize: '0.75rem', 
                    background: 'rgba(0, 223, 137, 0.08)', 
                    border: '1px solid rgba(0, 223, 137, 0.15)',
                    padding: '4px 12px', 
                    borderRadius: '99px',
                    color: 'var(--accent-color)'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-main)' }}>Project Overview</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '30px', whiteSpace: 'pre-line' }}>
                {selectedProject.longDescription || selectedProject.description}
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid var(--border-dim)', paddingTop: '24px' }}>
                {selectedProject.liveLink && (
                  <a href={selectedProject.liveLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                    Launch Application <ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.githubLink && (
                  <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    View Source Code <Github size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
