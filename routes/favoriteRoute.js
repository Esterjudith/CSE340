const express = require("express")
const router = new express.Router()
const favoriteController = require("../controllers/favoriteController")
const Util = require("../utilities")

// Show all favorites for the logged-in user
router.get("/", Util.checkLogin, favoriteController.buildFavorites)

// Add a vehicle to favorites
router.post("/add/:inv_id", Util.checkLogin, favoriteController.addFavorite)

// Remove a vehicle from favorites
router.post("/remove/:inv_id", Util.checkLogin, favoriteController.removeFavorite)

module.exports = router
