import React from 'react';

const AboutSection = () => {
  return (
    <section className="text-center py-5 bg-light">
      <div className="container">
        <h2 className="fw-bold text-primary mb-4">About Syntax Fission</h2>
        <p className="mb-5">Syntax Fission is a vibrant community where knowledge meets innovation. It's a next-gen Q&A platform designed for collaboration, expert advice, and growth.</p>
        <div className="row g-4">
          {[
            { icon: '🚀', title: 'What is?', desc: 'A next-gen forum platform for modern communities.' },
            { icon: '❓', title: 'FAQ', desc: 'Instant answers to commonly asked questions.' },
            { icon: '🛠️', title: 'Support', desc: '24/7 community and expert support.' }
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="fs-1 mb-3">{item.icon}</div>
                <h5 className="fw-semibold">{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
