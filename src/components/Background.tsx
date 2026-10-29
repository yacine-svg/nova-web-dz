/** The wallpaper the glass sits on: a calm gradient, two soft out-of-focus shapes, a faint brand glow and a fine grid the glass can bend */
export default function Background() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__glow" />
      <span className="aurora__shape aurora__shape--1" />
      <span className="aurora__shape aurora__shape--2" />
      <span className="aurora__dots" />
    </div>
  );
}
