module.exports = (req, res) => {
  res.status(200).json({ ok: true, route: "ping", time: new Date().toISOString() });
};
