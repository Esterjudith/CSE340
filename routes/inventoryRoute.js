// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/classification-validation")
const  invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view\
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailView));
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))

router.post(
    "/addClassification",
    regValidate.classificationInventoryRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.postClassification))

router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory))

router.post(
  "/addInventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.postInventory)
)

//Error router
router.get("/causeError", utilities.handleErrors(invController.throwError))

module.exports = router;