const utilities = require('../utilities/');
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav(req, res)
  res.render("account/login", {
    title: "Login",
    nav,  
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav(req, res)
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav(req, res)
  const { account_firstname, account_lastname, account_email, account_password }= req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav(req, res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      req.session.account = accountData

      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 *  Logout the current account
 * ************************** */
async function logoutAccount(req, res) {
  req.flash("notice", "You have successfully logged out.")
  req.session.destroy(() => {
    res.clearCookie("jwt")
    res.redirect("/")
  })
}

async function getAccountManagement (req, res) {
  let nav = await utilities.getNav(req, res)
  const accountData = req.session.account
  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null, 
    accountData
  })
}

/* ***************************
 * Update account page
 * ************************** */

async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav(req, res)
  const account_id = parseInt(req.params.account_id)
  const accountData = req.session.account
   res.render("account/update-account", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData,
    account_id
  })
}

async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updatedResults = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname, 
    account_email
  )
  if(typeof updatedResults === "object") {
    //this refreshes session data with the updated account
    req.session.account = updatedResults
    req.flash("notice", "Account information updated successfully.")   
  } else {
    req.flash("notice", "Sorry, the update failed. Please try again.")    
  }

  const nav = await utilities.getNav(req, res)
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/accountManagement", {
    title: "Account Management",
    nav,
    errors: null,
    accountData
  })
 
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
   try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (typeof updateResult === "object") {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed. Please try again.")
    }

    const nav = await utilities.getNav(req, res)
    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/accountManagement", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } catch (error) {
    console.error("updatePassword error:", error)
    req.flash("notice", "There was an error updating the password.")
    res.redirect(`/account/update/${account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, getAccountManagement, logoutAccount, buildUpdateAccount, updateAccount, updatePassword}
