const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation.js')

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.getAccountManagement))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Process the registration data: goes through validation and then error handleling
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process Account Update form
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process Password Change form
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)


router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccount))

module.exports = router;