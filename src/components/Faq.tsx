import { faq, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { PlusIcon, WhatsAppIcon } from "./Icons";

export default function Faq() {
  return (
    <section id="faq" className="section faq">
      <div className="wrap faq__layout">
        <div className="section__head faq__head">
          <h2 className="section__title">Questions fréquentes</h2>
          <p className="section__lead">Une autre question avant de choisir&nbsp;? Posez-la directement.</p>
          <a className="btn btn--whatsapp" href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Écrire sur WhatsApp
          </a>
        </div>
        <div className="faq__list">
          {faq.map((item) => (
            <details key={item.q} className="faq__item glass">
              <span className="glass__fx" aria-hidden="true" />
              <summary>
                <span>{item.q}</span>
                <span className="faq__icon" aria-hidden="true">
                  <PlusIcon />
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
