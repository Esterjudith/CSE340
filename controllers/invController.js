const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build classification detail view
 * ************************** */

invCont.buildDetailView = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInventoryId(inv_id);
  console.log("vehicle data:", data);
  const grid = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const make = data.inv_make;
  const model = data.inv_model;
  const year = data.inv_year;
  res.render("./inventory/detailInventory", {
    title: `${year} ${make} ${model}`,
    nav, 
    grid,
  })
}

invCont.buildManagement = async (req, res) => {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

invCont.buildAddClassification = async (req, res) => {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title:"Add Classification",
    nav,
    errors: null,
  });
}

invCont.postClassification = async (req, res) => {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  try {
    const regResult = await invModel.addClassification(classification_name)

    if (regResult) {
      req.flash("notice", `Your classification "${classification_name}" has been registered.`)
      return res.redirect("/inv/") 
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      return res.status(500).render("inventory/addClassification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name
      })
    }
  } catch (err) {
    console.error("Error adding classification:", err.message)
    req.flash("notice", "There was a problem processing your request.")
    return res.status(500).redirect("/inv/addClassification")
  }
}

/* ***************************
 *  Build inventory detail view
 * ************************** */

invCont.buildAddInventory = async (req, res) => {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/addInventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationList,  
    local: {} 
  })
}

invCont.postInventory = async (req, res) => {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)

  try {
    const result = await invModel.addInventory(req.body)
    if (result) {
      req.flash("notice", `The ${req.body.inv_year} ${req.body.inv_make} ${req.body.inv_model} was successfully added.`)
      return res.redirect("/inv/") 
    } else {
      req.flash("notice", "Sorry, the vehicle could not be added.")
      return res.status(500).render("inventory/addInventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList,
        locals: req.body
      })
    }
  } catch (err) {
    console.error("Error adding inventory:", err.message)
    req.flash("notice", "There was a problem processing your request.")
    return res.status(500).render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classificationList,
      locals: req.body
    })
  }
}


/* ***************************
 *  Build Error view
 * ************************** */

invCont.throwError = async (req, res) => {
  const error = new Error("Intentional 500 error testing")
  error.status = 500
  throw error
}

module.exports = invCont