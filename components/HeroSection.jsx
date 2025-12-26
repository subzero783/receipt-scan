import Link from "next/link";

const HeroSection = ({data}) => {

  const {title, subtitle, buttons} = data;

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Say goodbye to your messy receipt shoebox</h1>
            <p className="subtitle">Automatically capture and categorize business expenses with AI-powered technology. Transform receipt management from a headache to a one-click solution.</p>
            <div className="buttons">
              <Link
                href="/signup"
                className="btn btn-third"
              >
                Start Free
              </Link>
              <Link
                href="/about"
                className="btn btn-third"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
