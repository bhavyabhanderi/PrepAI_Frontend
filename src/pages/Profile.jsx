import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  RiUser3Line, RiMailLine, RiPhoneLine,
  RiMapPinLine, RiLockLine, RiSaveLine,
  RiPencilLine, RiCloseLine, RiShieldCheckLine,
  RiDeleteBinLine, RiFileTextLine, RiDownloadLine,
  RiEyeLine, RiEyeOffLine
} from 'react-icons/ri';
import { updateUser } from '../redux/slices/authSlice';
import { useTheme } from '../context/ThemeContext';
import { profileService, authService } from '../services/api';
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
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        let parsedSkills = [];
        if (Array.isArray(data.skills)) {
          parsedSkills = data.skills.flatMap(s => s.split(',').map(skill => skill.trim())).filter(Boolean);
        } else if (typeof data.skills === 'string') {
          parsedSkills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        parsedSkills = [...new Set(parsedSkills)];
        setSkills(parsedSkills);
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
    if (newSkill.trim()) {
      const newSkillsArray = newSkill.split(',').map(s => s.trim()).filter(Boolean);
      let hasChanges = false;
      const updatedSkills = [...skills];
      
      newSkillsArray.forEach(skill => {
        if (!updatedSkills.includes(skill)) {
          updatedSkills.push(skill);
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setSkills(updatedSkills);
        setNewSkill('');
        try {
          await profileService.updateProfile({ skills: updatedSkills });
          toast.success('Skill(s) added');
        } catch (err) {
          toast.error('Failed to save skill');
        }
      } else {
        setNewSkill('');
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

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return toast.error('Please fill in both password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    try {
      setPasswordUpdating(true);
      await authService.resetPasswordDirect(user.email, newPassword);
      toast.success('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordUpdating(false);
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
        {user?.profile_photo ? (
          <img
            src={user.profile_photo}
            alt={user?.name || 'User'}
            className="w-20 h-20 shrink-0 rounded-2xl object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-20 h-20 shrink-0 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
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
          <div className="space-y-4">
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Your Skills</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Add technical skills to help us tailor your interview questions.
            </p>
            
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                {skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm border"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}>
                    {skill}
                    <button onClick={(e) => { e.preventDefault(); removeSkill(skill); }} className="hover:text-error transition-colors flex items-center justify-center">
                      <RiCloseLine size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                placeholder="Type a skill and press Enter..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl border focus:border-primary-500 transition-colors text-sm outline-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} 
              />
              
              <button 
                onClick={(e) => { e.preventDefault(); addSkill(); }}
                disabled={!newSkill.trim()}
                className="shrink-0 px-6 py-3 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>New Password</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border focus-within:border-primary-500 transition-colors" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
                <input 
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password" 
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="tap-target text-sm"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showNewPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border focus-within:border-primary-500 transition-colors" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
                <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password" 
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="tap-target text-sm"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showConfirmPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <button 
              onClick={handleUpdatePassword} 
              disabled={passwordUpdating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {passwordUpdating ? 'Updating...' : 'Update Password'}
            </button>
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
                <button 
                  onClick={() => {
                    const newPrefs = { ...preferences, [setting.id]: !preferences[setting.id] };
                    localStorage.setItem('ai-interview-preferences', JSON.stringify(newPrefs));
                    setPreferences(newPrefs);
                    toast.success(`${setting.label} updated`);
                  }}
                  className={`shrink-0 w-12 h-6 rounded-full relative transition-colors ${preferences[setting.id] ? 'bg-primary-500' : 'bg-neutral-400'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${preferences[setting.id] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
