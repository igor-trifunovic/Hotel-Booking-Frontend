import SearchForm from "../components/SearchForm";

const features = [
  {
    icon: "🏨",
    title: "Thousands of Hotels",
    desc: "Browse a wide selection of hotels, resorts, and boutique stays worldwide.",
  },
  {
    icon: "💸",
    title: "Best Price Guarantee",
    desc: "We match prices so you always get the best deal on your booking.",
  },
  {
    icon: "🔒",
    title: "Secure Booking",
    desc: "Your personal data and payments are always protected with us.",
  },
  {
    icon: "🎯",
    title: "Easy Cancellation",
    desc: "Plans change. Cancel or modify your reservation with ease.",
  },
];

function HomePage() {
  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Your next adventure starts here</p>
          <h1 className="hero-title">Find Your Perfect Stay</h1>
          <p className="hero-subtitle">
            Search thousands of hotels, compare prices, and book instantly — all in one place.
          </p>
        </div>

        <div className="hero-search-card">
          <SearchForm />
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="features-section">
        <h2 className="features-heading">Why book with us?</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
