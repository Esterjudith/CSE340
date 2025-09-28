const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

invValidate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 1 }).withMessage("Enter a valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Enter valid miles."),
    body("inv_color").trim().isAlpha().withMessage("Color must be letters only."),
    body("classification_id").isInt().withMessage("Choose a classification.")
  ]
}

invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationList,
      locals: req.body 
    })
  }
  next()
}

module.exports = invValidate