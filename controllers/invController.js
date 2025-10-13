const invModel = require("../models/inventory-model")
const favModel = require("../models/favorites-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav(req, res)
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
  const inv_id = parseInt(req.params.inv_id, 10)
  const data = await invModel.getInventoryByInventoryId(inv_id);
  console.log("vehicle data:", data);
  const grid = await utilities.buildDetailView(data);
  let nav = await utilities.getNav(req, res);
  const make = data.inv_make;
  const model = data.inv_model;
  const year = data.inv_year;

  let isFavorited = false
  if (res.locals.loggedin) {
    try {
      isFavorited = await favModel.isFavorited(res.locals.accountData.account_id, inv_id)
    } catch (err) {
      console.error("Error checking favorites:", err)
    }
  }

  res.render("./inventory/detailInventory", {
    title: `${year} ${make} ${model}`,
    nav, 
    grid,
    inv_id,
    isFavorited
  })
}

invCont.buildManagement = async (req, res) => {
  let nav = await utilities.getNav(req, res)
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationSelect
  })
}

invCont.buildAddClassification = async (req, res) => {
  let nav = await utilities.getNav(req, res);
  res.render("inventory/addClassification", {
    title:"Add Classification",
    nav,
    errors: null,
  });
}

invCont.postClassification = async (req, res) => {
  let nav = await utilities.getNav(req, res)
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
  let nav = await utilities.getNav(req, res)
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
  let nav = await utilities.getNav(req, res)
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav(req, res)
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav(req, res)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav(req, res)
  const itemData = await invModel.getInventoryByInventoryId(inv_id)  
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */

invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id, 10)

  try {  
    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
      req.flash("notice", "The vehicle was successfully deleted.")
      return res.redirect("/inv/") 
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.redirect(`/inv/delete/${inv_id}`) 
    }
  } catch (err) {
    console.error("Error deleting inventory:", err.message)
    req.flash("notice", "There was a problem processing your request.")
    return res.redirect(`/inv/delete/${inv_id}`)
  }
}



module.exports = invCont