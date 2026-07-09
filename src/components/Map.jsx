const DELTA = 0.05;

const Map = ({ lat, lon, name }) => {
  const bbox = `${lon - DELTA},${lat - DELTA},${lon + DELTA},${lat + DELTA}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <iframe
      title={`Map of ${name}`}
      src={src}
      width="250"
      height="200"
      style={{ border: 0 }}
      loading="lazy"
    />
  );
};

export default Map;
