/** The "wallpaper" the glass sits on: slow aurora blobs and a fine dot grid the glass can visibly bend */
export default function Background() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora__blob aurora__blob--pink" />
      <span className="aurora__blob aurora__blob--cyan" />
      <span className="aurora__blob aurora__blob--amber" />
      <span className="aurora__blob aurora__blob--violet" />
      <span className="aurora__dots" />
    </div>
  );
}
