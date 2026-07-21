import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  RiUser3Line, RiMailLine, RiPhoneLine,
  RiMapPinLine, RiLockLine, RiSaveLine,
  RiPencilLine, RiCloseLine, RiShieldCheckLine,
  RiDeleteBinLine, RiFileTextLine, RiDownloadLine,
} from 'react-icons/ri';
import { updateUser } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { profileService } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Profile Page
 */
export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('ai-interview-preferences');
    return saved ? JSON.parse(saved) : { email: true, sound: true };
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await profileService.getProfile();
        const data = response.data;
        reset({
          name: user?.name || '',
          email: user?.email || '',
          phone: data.mobile || '',
          college: data.college || '',
          department: data.department || '',
          branch: data.branch || '',
          graduation_year: data.graduation_year || '',
          experience: data.experience || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
        });
        setSkills(data.skills || []);
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, [user, reset]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: RiUser3Line },
    { id: 'skills', label: 'Skills', icon: RiShieldCheckLine },
    { id: 'security', label: 'Security', icon: RiLockLine },
    { id: 'settings', label: 'Settings', icon: RiShieldCheckLine },
  ];

  const onSubmit = async (data) => {
    try {
      const response = await profileService.updateProfile({
        mobile: data.phone || null,
        college: data.college || null,
        department: data.department || null,
        branch: data.branch || null,
        graduation_year: data.graduation_year ? parseInt(data.graduation_year) : null,
        experience: data.experience || null,
        github: data.github || null,
        linkedin: data.linkedin || null,
        skills: skills,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const addSkill = async () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
      try {
        await profileService.updateProfile({ skills: updatedSkills });
        toast.success('Skill added');
      } catch (err) {
        toast.error('Failed to save skill');
      }
    }
  };

  const removeSkill = async (skill) => {
    const updatedSkills = skills.filter((s) => s !== skill);
    setSkills(updatedSkills);
    try {
      await profileService.updateProfile({ skills: updatedSkills });
      toast.success('Skill removed');
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };


  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          Loading profile details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage your personal information and preferences.</p>
      </motion.div>

      {/* Profile Header */}
      <div className="p-6 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="w-20 h-20 shrink-0 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name || 'John Doe'}</h2>
          <p className="text-sm truncate" style={{ color: 'var(--text-tertiary)' }}>{user?.email || 'john@example.com'}</p>
          <p className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block bg-primary-500/10 text-primary-500 font-medium">
            {user?.role === 'admin' ? 'Admin' : 'Student'}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="tap-target w-full sm:w-auto px-4 py-2 rounded-xl border text-sm font-medium hover:bg-primary-500/5 flex items-center justify-center gap-1.5"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <RiPencilLine size={14} /> Edit
        </button>
      </div>

      {/* Tabs */}
      {/* snap-row lets the 4 tabs swipe horizontally on a phone instead of squashing */}
      <div className="flex snap-row no-scrollbar gap-1 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-primary-500 text-white shadow-md' : ''
            }`}
            style={activeTab !== tab.id ? { color: 'var(--text-tertiary)' } : undefined}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        
        {activeTab === 'personal' && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Full Name', icon: RiUser3Line, type: 'text', disabled: true, autoComplete: 'name' },
                { name: 'email', label: 'Email', icon: RiMailLine, type: 'email', disabled: true, inputMode: 'email', autoComplete: 'email' },
                { name: 'phone', label: 'Phone', icon: RiPhoneLine, type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
                { name: 'college', label: 'College', icon: RiUser3Line, type: 'text' },
                { name: 'department', label: 'Department', icon: RiUser3Line, type: 'text' },
                { name: 'branch', label: 'Branch', icon: RiUser3Line, type: 'text' },
                { name: 'graduation_year', label: 'Graduation Year', icon: RiUser3Line, type: 'number', inputMode: 'numeric' },
                { name: 'experience', label: 'Experience Details', icon: RiFileTextLine, type: 'text' },
                { name: 'github', label: 'GitHub Link', icon: RiFileTextLine, type: 'url', inputMode: 'url' },
                { name: 'linkedin', label: 'LinkedIn Link', icon: RiFileTextLine, type: 'url', inputMode: 'url' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{field.label}</label>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                    <field.icon style={{ color: 'var(--text-tertiary)' }} />
                    <input type={field.type} inputMode={field.inputMode} autoComplete={field.autoComplete} disabled={field.disabled || !isEditing}
                      className="flex-1 min-w-0 bg-transparent text-sm outline-none disabled:opacity-60"
                      style={{ color: 'var(--text-primary)' }} {...register(field.name)} />
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
                  <RiSaveLine size={14} /> Save Changes
                </button>
              </div>
            )}
          </form>
        )}

        {activeTab === 'skills' && (
          <div>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Your Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="tap-target hover:text-error transition-colors">
                    <RiCloseLine size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..."
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border bg-transparent text-sm outline-none"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'var(--input-bg)' }} />
              <button onClick={addSkill} className="shrink-0 px-4 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90">Add</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
            {['Current Password', 'New Password', 'Confirm Password'].map((label) => (
              <div key={label}>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>{label}</label>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                  <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
                  <input type="password" autoComplete={label === 'Current Password' ? 'current-password' : 'new-password'} placeholder={label}
                    className="flex-1 min-w-0 bg-transparent text-sm outline-none"
                    style={{ color: 'var(--text-primary)' }} />
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Password updated successfully')} className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90">Update Password</button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Preferences</h3>
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Toggle between dark and light theme</p>
              </div>
              <button onClick={toggleTheme} className={`shrink-0 w-12 h-6 rounded-full relative transition-colors ${isDark ? 'bg-primary-500' : 'bg-neutral-400'}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive interview reminders via email' },
              { id: 'sound', label: 'Sound Effects', desc: 'Play sounds during interviews' },
            ].map((setting) => (
              <div key={setting.id} className="flex items-center justify-between gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{setting.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{setting.desc}</p>
                </div>
                <input
                  type="checkbox" 
                  checked={preferences[setting.id]} 
                  onChange={() => {
                    setPreferences(prev => {
                      const newPrefs = { ...prev, [setting.id]: !prev[setting.id] };
                      localStorage.setItem('ai-interview-preferences', JSON.stringify(newPrefs));
                      return newPrefs;
                    });
                    toast.success(`${setting.label} updated`);
                  }}
                  className="shrink-0 w-5 h-5 rounded accent-primary-700"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
