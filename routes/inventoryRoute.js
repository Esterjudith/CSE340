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
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//protected GET routes for only admin and employee:
router.get("/addClassification", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddClassification))
router.get("/addInventory", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.buildAddInventory))
router.get("/edit/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.editInventoryView))
router.get("/delete/:inv_id", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventoryView))


router.post(
    "/addClassification",
    regValidate.classificationInventoryRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.postClassification))

//Protected POST request for admin and employees only
router.post(
  "/addInventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.postInventory)
)

router.post("/update/",
 invValidate.inventoryRules(),
 invValidate.checkUpdateData,
 utilities.checkEmployeeOrAdmin, 
 utilities.handleErrors(invController.updateInventory))

 router.post("/delete", utilities.checkEmployeeOrAdmin, utilities.handleErrors(invController.deleteInventory))


//Error router
router.get("/causeError", utilities.handleErrors(invController.throwError))

module.exports = router;