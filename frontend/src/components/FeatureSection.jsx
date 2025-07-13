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
    <section className="py-5 bg-white">
      <div className="container text-center">
        <h2 className="text-info fw-bold mb-4">Powerful Features</h2>
        <p className="text-muted mb-5">Everything you need for the perfect forum experience.</p>

        <div className="row g-4 justify-content-center">
          {features.map((feat, index) => (
            <div key={index} className="col-sm-10 col-md-6 col-lg-4">
              <div className="p-4 border rounded shadow-sm h-100">
                <div className="fs-1 text-warning mb-3">{feat.icon}</div>
                <h5 className="fw-semibold">{feat.title}</h5>
                <p className="text-secondary">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
