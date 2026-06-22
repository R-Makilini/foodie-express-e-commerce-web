const express = require("express");
const router = express.Router();
const { placeRequest, getMyRequests, getAllRequests, updateRequestStatus } = require("../controllers/requestController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, placeRequest);
router.get("/my", protect, getMyRequests);
router.get("/all", protect, adminOnly, getAllRequests);
router.put("/:id/status", protect, adminOnly, updateRequestStatus);

module.exports = router;
