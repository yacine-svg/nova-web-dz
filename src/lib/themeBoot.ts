export const THEME_KEY = "nova-theme";

/** Runs in <head> before the page paints, so a saved choice never flashes the wrong theme */
export const themeBootScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
