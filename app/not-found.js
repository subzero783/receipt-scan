import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <section className="not-found-section">
      <div className="container">
        <div className="row">
          <div className="col">
            <FaExclamationTriangle />
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Go Home</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
