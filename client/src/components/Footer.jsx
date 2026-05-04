//client/src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>NewBrend Furniture</h3>
          <p>Premium furniture and bespoke interior design.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Collection</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Services</h4>
          <p>Furniture Design</p>
          <p>Interior Styling</p>
          <p>Custom Builds</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} NewBrend Furniture. All rights reserved.
      </div>
    </footer>
  );
}
