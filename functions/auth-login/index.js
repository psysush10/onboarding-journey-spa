const catalyst = require("zcatalyst-sdk-node");

module.exports = async (req, res) => {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // ✅ Parse body manually
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { email, password } = body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const app = catalyst.initialize(req);
  const userMgmt = app.userManagement();

  try {
    const result = await userMgmt.login({
      email_id: email,
      password,
    });
    res.json(result);
  } catch (e) {
    res.status(401).json(e);
  }
};