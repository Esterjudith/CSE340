const favModel = require("../models/favorites-model")
const utilities = require("../utilities")

const favoriteController = {}

/* ***************************
 *  Build "My Favorites" view
 * ************************** */
favoriteController.buildFavorites = async function (req, res, next) {
  try {
    let nav = await utilities.getNav(req, res)
    const account_id = res.locals.accountData.account_id 
    const items = await favModel.getFavoritesByAccount(account_id)

    res.render("./favorites/index", {
      title: "My Favorites",
      nav,
      errors: null,
      items
    })
  } catch (err) {
    console.error("Error building favorites view:", err)
    next(err)
  }
}

/* ***************************
 *  Add Favorite
 * ************************** */
favoriteController.addFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.params.inv_id, 10)

    const inserted = await favModel.addFavorite(account_id, inv_id)

    if (inserted) {
      req.flash("notice", "Vehicle saved to Favorites.")
    } else {
      req.flash("notice", "This vehicle is already in your Favorites.")
    }
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (err) {
    console.error("Error adding favorite:", err)
    req.flash("notice", "Unable to add favorite.")
    res.redirect("/inv/")
  }
}

/* ***************************
 *  Remove Favorite
 * ************************** */
favoriteController.removeFavorite = async function (req, res, next) {
  try {
    const account_id = res.locals.accountData.account_id
    const inv_id = parseInt(req.params.inv_id, 10)

    const removed = await favModel.removeFavorite(account_id, inv_id)

    if (removed) {
      req.flash("notice", "Vehicle removed from Favorites.")
    } else {
      req.flash("notice", "Vehicle was not found in your Favorites.")
    }
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (err) {
    console.error("Error removing favorite:", err)
    req.flash("notice", "Unable to remove favorite.")
    res.redirect("/inv/")
  }
}

module.exports = favoriteController
