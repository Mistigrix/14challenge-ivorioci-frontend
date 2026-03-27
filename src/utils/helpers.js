export const fmtDuration = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ""}` : `${m}min`;
};

export const fmtTime = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
};

export const getCoverGradient = (title) => {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(145deg, hsl(${hue1}, 60%, 25%), hsl(${hue2}, 50%, 18%))`;
};

export const getBannerGradient = (title) => {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue1 = hash % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 55%, 20%) 0%, hsl(${hue1}, 40%, 10%) 100%)`;
};