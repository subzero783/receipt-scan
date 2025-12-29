import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosClose } from "react-icons/io";

const FAQs = ({ data }) => {
  const { title, subtitle, questions } = data;

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
              {questions.map((item, index) => (
                <div
                  className="question"
                  key={index}
                >
                  <div className="question-and-icon">
                    <p className="question-text">{item.question}</p>
                    <MdKeyboardArrowDown />
                    <IoIosClose />
                  </div>
                  <div className="answer-container">
                    <p className="answer">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
