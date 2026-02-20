import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <section className="not-found-section">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="top-text">
                <FaExclamationTriangle className="icon" />
                <h1 className="title">This page got lost in the shoebox</h1>
                <p className="subtitle">The page you're looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to tracking your expenses.</p>
                <div className="buttons-container">
                  <Link href="/dashboard" className="btn btn-third">Go to Dashboard</Link>
                  <Link href="/" className="btn btn-third">Go Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
