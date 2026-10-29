import { site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { InstagramIcon, NovaLogo, WhatsAppIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__bar glass glass--edge">
          <span className="glass__fx" aria-hidden="true" />
          <span className="footer__brand">
            <NovaLogo size={34} gradientId="nova-logo-footer" />
            Nova Web Dz
          </span>
          <span className="footer__links">
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
              {site.instagramHandle}
            </a>
            <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              WhatsApp
            </a>
          </span>
          <span className="footer__copy">© {new Date().getFullYear()} Nova Web Dz, Algérie</span>
        </div>
      </div>
    </footer>
  );
}
