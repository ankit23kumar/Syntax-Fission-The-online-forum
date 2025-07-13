import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-5 bg-light text-center">
      <div className="container">
        <h2 className="fw-bold text-info mb-4">About Syntax Fission</h2>
        <p className="text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}>
          Syntax Fission is a vibrant community where knowledge meets innovation. It's a next-gen Q&A platform designed for collaboration, expert advice, and growth.
        </p>

        <div className="row g-4 justify-content-center">
          {[
            { icon: '🚀', title: 'What is?', desc: 'A next-gen forum platform for modern communities.' },
            { icon: '❓', title: 'FAQ', desc: 'Instant answers to commonly asked questions.' },
            { icon: '🛠️', title: 'Support', desc: '24/7 community and expert support.' },
          ].map((item, index) => (
            <div key={index} className="col-sm-10 col-md-6 col-lg-4">
              <div className="bg-white rounded shadow-sm p-4 h-100">
                <div className="fs-1 mb-3">{item.icon}</div>
                <h5 className="fw-semibold">{item.title}</h5>
                <p className="text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
