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
 *  Build inventory detail view
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
    grid
  })
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