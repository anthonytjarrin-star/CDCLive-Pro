export default function handler(req, res) {
  const place = req.query.place || "Quito, Ecuador";

  const data = {
    ok: true,
    place,
    headlines: [
      { title: `Top story in ${place}`, source: "CDC Live", link: "#" },
      { title: `${place} — Economy and Growth`, source: "CDC Live", link: "#" },
      { title: `${place} — Politics and Society`, source: "CDC Live", link: "#" }
    ],
    stats: { GDP: "Demo $", Population: "Demo —", Inflation: "Demo %" },
    wiki: { extract: `This is a demo summary for ${place}.` }
  };

  res.status(200).json(data);
}
