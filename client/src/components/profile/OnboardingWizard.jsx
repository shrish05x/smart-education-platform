import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './OnboardingWizard.css';

// Step components
import BasicDetails from './ProfileSteps/BasicDetails';
import ContactInfo from './ProfileSteps/ContactInfo';
import AcademicDetails from './ProfileSteps/AcademicDetails';
import SkillsInterests from './ProfileSteps/SkillsInterests';
import Projects from './ProfileSteps/Projects';
import Internships from './ProfileSteps/Internships';
import Achievements from './ProfileSteps/Achievements';
import Documents from './ProfileSteps/Documents';

const STEPS = [
  { key: 'profile', label: 'Basic', icon: '👤' },
  { key: 'contact', label: 'Contact', icon: '📞' },
  { key: 'education', label: 'Academic', icon: '🎓' },
  { key: 'skill', label: 'Skills', icon: '⚡' },
  { key: 'projects', label: 'Projects', icon: '💻' },
  { key: 'internships', label: 'Internships', icon: '🏢' },
  { key: 'achievement', label: 'Achieve', icon: '🏆' },
  { key: 'document', label: 'Docs', icon: '📄' },
];

const OnboardingWizard = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    profile: {},
    contact: {},
    education: {},
    skill: { technicalSkills: [], interests: [], hobbies: [] },
    projects: [],
    internships: [],
    achievement: { hackathons: [], technicalEvents: [], clubMemberships: [] },
    document: {},
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completionData, setCompletionData] = useState({ completionPercentage: 0, isVerified: false });

  // Load existing profile data
  useEffect(() => {
    if (!user?._id) return;
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/profile/${user._id}`);
        if (data.success) {
          setProfileData(prev => ({
            ...prev,
            ...data.data,
            skill: data.data.skill?.technicalSkills ? data.data.skill : prev.skill,
            achievement: data.data.achievement?.hackathons ? data.data.achievement : prev.achievement,
          }));
        }
      } catch (err) {
        console.log('No existing profile found, starting fresh');
      }
    };
    fetchProfile();
    fetchCompletion();
  }, [user]);

  const fetchCompletion = async () => {
    if (!user?._id) return;
    try {
      const { data } = await api.get(`/profile/completion-status/${user._id}`);
      if (data.success) setCompletionData(data.data);
    } catch (err) {
      console.error('Error fetching completion:', err);
    }
  };

  // Auto-save section
  const saveSection = useCallback(async (section, sectionData) => {
    if (!user?._id) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.put('/profile/update', {
        userId: user._id,
        section,
        data: sectionData,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      fetchCompletion();
    } catch (err) {
      console.error('Error saving section:', err);
    } finally {
      setSaving(false);
    }
  }, [user]);

  const updateSectionData = (section, data) => {
    setProfileData(prev => ({ ...prev, [section]: data }));
  };

  const handleNext = async () => {
    const stepKey = STEPS[currentStep].key;
    await saveSection(stepKey, profileData[stepKey]);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
      fetchCompletion();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(prev => prev + 1);
  };

  const handleStepClick = (idx) => {
    setCurrentStep(idx);
  };

  const progressWidth = `calc(${(currentStep / (STEPS.length - 1)) * 100}% )`;

  const renderStep = () => {
    const props = { data: profileData, update: updateSectionData };
    switch (currentStep) {
      case 0: return <BasicDetails {...props} />;
      case 1: return <ContactInfo {...props} />;
      case 2: return <AcademicDetails {...props} />;
      case 3: return <SkillsInterests {...props} />;
      case 4: return <Projects {...props} />;
      case 5: return <Internships {...props} />;
      case 6: return <Achievements {...props} />;
      case 7: return <Documents {...props} />;
      default: return null;
    }
  };

  if (completed) {
    return (
      <div className="onboarding-wizard">
        <div className="step-card success-message">
          <div className="check-icon">🎉</div>
          <h2>Profile Submitted!</h2>
          <p>Your profile is now {completionData.completionPercentage}% complete.</p>
          {completionData.isVerified ? (
            <div style={{ marginTop: '1.5rem' }}>
              <span className="verified-badge">✔ Verified Profile</span>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              <span className="incomplete-badge">⚠ Incomplete — fill remaining fields for verification</span>
            </div>
          )}
          <div className="completion-bar-wrapper" style={{ maxWidth: 320, margin: '1.5rem auto 0' }}>
            <div className="completion-bar-track">
              <div className="completion-bar-fill" style={{ width: `${completionData.completionPercentage}%` }}></div>
            </div>
            <div className="completion-text">{completionData.completionPercentage}% Complete</div>
          </div>
          <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => { setCompleted(false); setCurrentStep(0); }}>
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-wizard">
      <h1>Complete Your Profile</h1>
      <p className="subtitle">Fill in your details step by step to get verified ✔</p>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-fill" style={{ width: progressWidth }}></div>
        {STEPS.map((step, idx) => (
          <div
            key={step.key}
            className={`progress-step ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            onClick={() => handleStepClick(idx)}
          >
            <div className="step-circle">
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="step-card" key={currentStep}>
        {renderStep()}

        {saveSuccess && (
          <div className="save-indicator">✓ Saved successfully</div>
        )}

        {/* Navigation */}
        <div className="wizard-nav">
          <button className="btn-secondary" onClick={handlePrev} disabled={currentStep === 0}>
            ← Previous
          </button>
          <button className="btn-skip" onClick={handleSkip}>
            Skip for now
          </button>
          <button className="btn-primary" onClick={handleNext} disabled={saving}>
            {saving ? 'Saving...' : currentStep === STEPS.length - 1 ? 'Submit Profile' : 'Save & Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
