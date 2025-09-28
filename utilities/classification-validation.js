const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

  validate.classificationInventoryRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()          
        .matches(/^[A-Za-z]+$/)
        .withMessage("Classification name must contain only letters, no spaces or special characters.")
    ]
  }

  validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
        errors,    
        title: "Add Classification",
        nav,
        classification_name       
        })
        return
    }
    next()
  }

  module.exports = validate