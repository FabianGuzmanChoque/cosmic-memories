export const calculateOrbitPosition = (angle, radius, eccentricity = 0) => {
  const r = radius * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(angle));
  return {
    x: r * Math.cos(angle),
    z: r * Math.sin(angle),
    y: 0
  };
};

export const calculateOrbitalSpeed = (radius, mass = 1) => {
  const G = 1;
  return Math.sqrt(G * mass / Math.radius);
};

export const getOrbitalPeriod = (radius) => {
  return 2 * Math.PI * Math.sqrt(Math.pow(radius, 3));
};

export const generateOrbitPath = (radius, segments = 64) => {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push({
      x: Math.cos(angle) * radius,
      y: 0,
      z: Math.sin(angle) * radius
    });
  }
  return points;
};

export const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

export const sphericalToCartesian = (radius, theta, phi) => {
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  };
};