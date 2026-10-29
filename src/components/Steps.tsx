import { steps } from "@/config/site";

export default function Steps() {
  return (
    <section id="methode" className="section steps">
      <div className="wrap">
        <div className="section__head">
          <h2 className="section__title">Comment ça marche</h2>
          <p className="section__lead">Quatre étapes, de votre choix sur ce site jusqu&apos;à la mise en ligne.</p>
        </div>
        <ol className="steps__list">
          {steps.map((s, i) => (
            <li key={s.title} className="steps__item">
              <span className="steps__num glass" aria-hidden="true">
                <span className="glass__fx" />
                {i + 1}
              </span>
              <h3 className="steps__title">{s.title}</h3>
              <p className="steps__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
