/** The "wallpaper" the glass sits on: the logo's gradient, two slow sheets of light, and a fine dot grid the glass can visibly bend */
export default function Background() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__light aurora__light--a" />
      <span className="aurora__light aurora__light--b" />
      <span className="aurora__dots" />
    </div>
  );
}
