import React from 'react';

const features = [
  { icon: '💬', title: 'AI Question & Answer', desc: 'Get intelligent answers powered by community-trained AI.' },
  { icon: '🔍', title: 'Advanced Q&A Filter', desc: 'Search by tags, difficulty, and more with powerful filters.' },
  { icon: '👤', title: 'User Profiles', desc: 'Build professional presence with rich user profiles.' },
  { icon: '🛡️', title: 'Content Moderation', desc: 'AI-powered moderation ensures respectful, quality content.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track engagement and contributions across the platform.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated with intelligent, personalized alerts.' },
];

const FeatureSection = () => {
  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="text-primary fw-bold mb-4">Powerful Features</h2>
        <p className="mb-5">Everything you need for the perfect forum experience.</p>
        <div className="row g-4">
          {features.map((feat, index) => (
            <div key={index} className="col-md-4">
              <div className="border rounded p-4 shadow-sm bg-white">
                <div className="fs-1 text-warning mb-3">{feat.icon}</div>
                <h5 className="fw-semibold">{feat.title}</h5>
                <p>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
