import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

const NotFoundPage = () => {
  return (
    <section className="not-found-section">
      <Container>
        <Row>
          <Col>
            <FaExclamationTriangle />
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Go Home</Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NotFoundPage;
