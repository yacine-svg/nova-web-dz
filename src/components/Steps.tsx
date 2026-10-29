import { steps } from "@/config/site";
import SplitTitle from "./SplitTitle";

export default function Steps() {
  return (
    <section id="methode" className="section steps">
      <div className="wrap">
        <div className="section__head">
          <SplitTitle className="section__title" text="Comment ça marche" />
          <p className="section__lead" data-fx="fade">
            Quatre étapes, de votre choix sur ce site jusqu&apos;à la livraison.
          </p>
        </div>
        <ol className="steps__list">
          {steps.map((s, i) => (
            <li key={s.title} className="steps__item">
              {i < steps.length - 1 && <span className="steps__line" aria-hidden="true" />}
              <span className="steps__num glass glass--lens" aria-hidden="true">
                <span className="glass__fx" />
                {i + 1}
              </span>
              <h3 className="steps__title" data-fx="fade" data-fx-delay={i * 0.12}>
                {s.title}
              </h3>
              <p className="steps__text" data-fx="fade" data-fx-delay={i * 0.12 + 0.08}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
