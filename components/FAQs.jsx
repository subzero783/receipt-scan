"use client";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const FAQs = ({ data }) => {
  const { title, subtitle, questions } = data;
  const [questionOpen, setQuestionOpen] = useState(null);

  // 1. Initialize state as an empty array
  const [openIndices, setOpenIndices] = useState([]);

  // 2. Function to toggle specific index in/out of the array
  const toggleQuestion = (index) => {
    setOpenIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        // If index is already open, filter it out (close it)
        return prevIndices.filter((i) => i !== index);
      } else {
        // If index is not open, add it to the array (open it)
        return [...prevIndices, index];
      }
    });
  };

  return (
    <section className="faqs-section">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="top-text">
              <h2 className="title">{title}</h2>
              <p className="subtitle">{subtitle}</p>
            </div>
            <div className="questions">
              {questions.map((item, index) => {
                const isOpen = openIndices.includes(index);
                return (
                  <div
                    className={`question ${isOpen ? "question-open" : ""}`}
                    key={index}
                  >
                    <div className="question-and-icon">
                      <p className="question-text">{item.question}</p>
                      <MdKeyboardArrowDown
                        className="arrow-down"
                        onClick={() => {
                          toggleQuestion(index);
                        }}
                      />
                      <IoIosClose
                        className="close-icon"
                        onClick={() => {
                          toggleQuestion(index);
                        }}
                      />
                    </div>
                    <div className="answer-container">
                      <p className="answer">{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
