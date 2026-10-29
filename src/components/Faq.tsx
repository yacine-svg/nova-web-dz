import { faq, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { PlusIcon, WhatsAppIcon } from "./Icons";
import SplitTitle from "./SplitTitle";

export default function Faq() {
  return (
    <section id="faq" className="section faq">
      <div className="wrap faq__layout" data-fx="section">
        <div className="section__head faq__head">
          <SplitTitle className="section__title" text="Questions fréquentes" />
          <p className="section__lead" data-fx="fade">
            Une autre question avant de choisir&nbsp;? Posez-la directement.
          </p>
          <div className="faq__cta" data-fx="fade" data-fx-delay="0.1">
            <a className="btn btn--whatsapp" href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
        <div className="faq__list">
          {faq.map((item) => (
            <details key={item.q} className="faq__item glass glass--edge">
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
