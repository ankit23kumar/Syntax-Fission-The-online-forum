import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import FilterSwitch from "../components/FilterSwitch";
import { getAllQuestions } from "../services/qaService";
import "../styles/NewQuestions.css";
import { Link, useSearchParams } from "react-router-dom";

const NewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "Newest";
  const tags = searchParams.get("tags") || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await getAllQuestions({ filter, tags }); // pass filter to service
        setQuestions(res.data);
      } catch (err) {
        console.error(
          "Error fetching questions:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filter, tags]);

  return (
    <>
      <Navbar />
      <div className="container-fluid p-0 d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">New Questions</h3>
            <Link to="/ask-question">
              <button className="btn btn-info text-white">Ask Question</button>
            </Link>
          </div>

          <FilterSwitch />

          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <div className="question-list">
              {questions.map((question) => (
                <div key={question.question_id} className="border-bottom py-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex gap-4 small text-muted">
                      <div>{question.upvotes - question.downvotes} Votes</div>
                      <div>{question.answer_count} Answer</div>
                      <div>00 Views</div> {/* Placeholder for now */}
                    </div>
                  </div>
                  <h5 className="text-primary fw-bold mb-1">
                    <Link
                      to={`/questions/${question.question_id}`}
                      className="text-decoration-none text-primary"
                    >
                      {question.title}
                    </Link>
                  </h5>
                  <p className="mb-2 small text-muted">
                    {question.content.slice(0, 100)}...
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-2 flex-wrap">
                      {question.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="badge bg-light text-dark border"
                        >
                          {tag.tag_name}
                        </span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <img
                        src={
                          question.user.profile_picture ||
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt="user"
                        width={25}
                        height={25}
                        className="rounded-circle"
                      />
                      <span>{question.user.name}</span>
                      <small>
                        asked{" "}
                        {new Date(question.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer/>
    </>
  );
};

export default NewQuestions;
