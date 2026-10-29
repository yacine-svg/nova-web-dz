import { demos } from "@/config/site";
import { ArrowUpRightIcon } from "./Icons";
import SplitTitle from "./SplitTitle";

export default function Examples() {
  return (
    <section id="exemples" className="section examples">
      <div className="wrap" data-fx="section">
        <div className="section__head">
          <SplitTitle className="section__title" text="Des sites déjà en ligne" />
          <p className="section__lead" data-fx="fade">
            Des sites de démonstration réalisés par Nova Web Dz. Ouvrez-les sur votre téléphone pour voir le rendu réel.
          </p>
        </div>
        <ul className="examples__list">
          {demos.map((d) => (
            <li key={d.url} className="examples__item">
              <span className="examples__rule" aria-hidden="true" />
              <a className="examples__row" href={d.url} target="_blank" rel="noopener noreferrer">
                <span className="examples__name">{d.name}</span>
                <span className="examples__label">{d.label}</span>
                <span className="examples__url">{d.url.replace("https://", "")}</span>
                <span className="examples__go-pop" aria-hidden="true">
                  <span className="examples__go glass">
                    <span className="glass__fx" />
                    <ArrowUpRightIcon />
                  </span>
                </span>
                <span className="sr-only"> (ouvre un nouvel onglet)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
