// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view\
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Error router
router.get("/causeError", utilities.handleErrors(invController.throwError))

module.exports = router;