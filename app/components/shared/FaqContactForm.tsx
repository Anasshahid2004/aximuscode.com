// Ports the "Contact Form H_1" Contact Form 7 template (demo-data/content.xml)
// as a static form - there's no CMS/backend in this rebuild, so this only
// reproduces the original's markup/classes (nm-faqs-1-contact-form,
// form-input, form-checkbox, button-x-author) which nimo-core.css already
// styles; it doesn't actually submit anywhere.
export default function FaqContactForm() {
  return (
    <form className="nm-faqs-1-contact-form" onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="text" className="form-input nm-p-1 wa_placeholder" placeholder="Full name" required />
      <input type="email" name="email" className="form-input nm-p-1 wa_placeholder" placeholder="Your email" required />
      <textarea name="message" className="form-input nm-p-1 wa_placeholder" placeholder="Your message" required />

      <div className="form-checkbox wow fadeInUp2">
        <input id="checkbox" type="checkbox" />
        <label className="checkbox-label nm-p-1" htmlFor="checkbox">
          Subscribe to Newsletter
        </label>
      </div>

      <div className="button-x-author wow fadeInUp2" data-wow-delay=".1s">
        <div className="author">
          <div className="author-img wa-img-cover wa-fix">
            <img src="/images/t1-author-1.webp" alt="Liven Geo" />
          </div>
          <div className="content">
            <h4 className="nm-h-1 author-name">Liven Geo</h4>
            <p className="nm-p-1 author-dg">Support Developer</p>
          </div>
        </div>
        <button type="submit" className="nm-pr-btn-1 has-v2 wa_magnetic_btn_2">
          <span className="icon wa_magnetic_btn_2_elm">
            <i className="fa-solid fa-arrow-right-long" />
            <i className="fa-solid fa-arrow-right-long" />
          </span>
          <span className="text" data-back="Submit now" data-front="Submit now" />
        </button>
      </div>
    </form>
  );
}
