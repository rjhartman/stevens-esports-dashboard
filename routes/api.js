const express = require("express");
const router = express.Router();
const users = require("./../data/users.js");
const { ObjectID } = require("mongodb");

router.get("/users", async (req, res) => {
  res.json(await users.getAllUsers(true));
});

router.post("/users/:id/promote", async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try {
    await users.setRole(id, "administrator");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.post("/users/:id/demote", async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try {
    await users.setRole(id, "regular");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

module.exports = router;
