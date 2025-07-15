import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";  
import FilterSwitch from "../components/FilterSwitch";
import "../styles/NewQuestions.css"; 

const NewQuestions = () => {
  // Sample repeated question layout – dynamic content to be added later
  const sampleQuestions = Array(4).fill({
    title: "A Huge Text of Title of Questions in New Question Page",
    body: "Lorem ipsum dolor sit amet consectetur. Purus vel placerat pellentesque eleifend dui ornare risus. Fringilla sed eget adipiscing elit suspendisse.",
    author: "Jack William",
    date: "2 days ago",
    tags: ["Tag", "Tag", "Tag"],
  });

  return (
    <>
      <Navbar />

      <div className="container-fluid p-0 d-flex">
        {/* Sidebar */}
        <Sidebar/>
        
        {/* Main Content */}
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">New Questions</h3>
            <button className="btn btn-info text-white">Ask Question</button>
          </div>

          <FilterSwitch/>

          <div className="question-list">
            {sampleQuestions.map((question, index) => (
              <div key={index} className="border-bottom py-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex gap-4 small text-muted">
                    <div>00 Votes</div>
                    <div>00 Answer</div>
                    <div>00 Views</div>
                  </div>
                </div>

                <h5 className="text-primary fw-bold mb-1">
                  {question.title}
                </h5>
                <p className="mb-2 small text-muted">{question.body}</p>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex gap-2">
                    {question.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-light text-dark border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      alt="user"
                      width={25}
                      height={25}
                      className="rounded-circle"
                    />
                    <span>{question.author}</span>
                    <small>asked {question.date}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white mt-4 p-4">
        <div className="container d-flex flex-column flex-md-row justify-content-between">
          <div>
            <h5>Syntax Fission</h5>
            <p>Follow Us</p>
            <div className="d-flex gap-3">
              <i className="bi bi-whatsapp"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-google"></i>
            </div>
          </div>
          <div>
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>Home</li>
              <li>About</li>
              <li>Questions and Answers</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h6>Terms & Policy</h6>
            <ul className="list-unstyled">
              <li>FAQ</li>
              <li>Privacy and Conditions</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-3 small">
          &copy; 2025 | Designed and Coded by Ankit Kumar
        </div>
      </footer>
    </>
  );
};

export default NewQuestions;
