import { demos } from "@/config/site";
import { ArrowUpRightIcon } from "./Icons";

export default function Examples() {
  return (
    <section id="exemples" className="section examples">
      <div className="wrap">
        <div className="section__head">
          <h2 className="section__title">Des sites déjà en ligne</h2>
          <p className="section__lead">
            Des sites de démonstration réalisés par Nova Web Dz. Ouvrez-les sur votre téléphone pour voir le rendu réel.
          </p>
        </div>
        <ul className="examples__list">
          {demos.map((d) => (
            <li key={d.url}>
              <a className="examples__row" href={d.url} target="_blank" rel="noopener noreferrer">
                <span className="examples__name">{d.name}</span>
                <span className="examples__label">{d.label}</span>
                <span className="examples__url">{d.url.replace("https://", "")}</span>
                <span className="examples__go glass" aria-hidden="true">
                  <span className="glass__fx" />
                  <ArrowUpRightIcon />
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
