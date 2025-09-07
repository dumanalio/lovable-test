import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);

    // Show success notification (this will be handled by the notification system)
    console.log("Form submitted:", formData);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Lass uns sprechen</h2>
          <p>
            Hast du Fragen zu unserer Kollektion oder benötigst du eine
            individuelle Beratung?
          </p>
          <div className="contact-methods">
            <div className="contact-method">
              <i className="fas fa-envelope"></i>
              <span>hello@posterlux.de</span>
            </div>
            <div className="contact-method">
              <i className="fas fa-phone"></i>
              <span>+49 123 456 789</span>
            </div>
            <div className="contact-method">
              <i className="fas fa-map-marker-alt"></i>
              <span>Berlin, Deutschland</span>
            </div>
          </div>
        </div>
        <form className="contact-form glassmorphism" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Dein Name"
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Deine E-Mail"
              required
            />
            <label htmlFor="email">E-Mail</label>
          </div>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Deine Nachricht"
              required
            />
            <label htmlFor="message">Nachricht</label>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <span>
              {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
            </span>
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
