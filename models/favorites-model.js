const pool = require("../database/") 

/* ***************************
 * Add a vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorite (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING favorite_id, created_at
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0] || null 
  } catch (error) {
    console.error("addFavorite error:", error)
    throw error
  }
}

/* ***************************
 * Remove a vehicle from favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorite
      WHERE account_id = $1 AND inv_id = $2
      RETURNING favorite_id
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0 
  } catch (error) {
    console.error("removeFavorite error:", error)
    throw error
  }
}

/* ***************************
 * Check if a vehicle is already favorited
 * ************************** */
async function isFavorited(account_id, inv_id) {
  try {
    const sql = `
      SELECT 1 FROM favorite
      WHERE account_id = $1 AND inv_id = $2
      LIMIT 1
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("isFavorited error:", error)
    throw error
  }
}

/* ***************************
 * Get all favorites for a user
 * ************************** */
async function getFavoritesByAccount(account_id) {
  try {
    const sql = `
      SELECT 
        i.inv_id, i.inv_make, i.inv_model, i.inv_year,
        i.inv_price, i.inv_thumbnail, i.inv_miles, i.inv_color,
        c.classification_name,
        f.created_at
      FROM favorite f
      JOIN inventory i ON i.inv_id = f.inv_id
      JOIN classification c ON c.classification_id = i.classification_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getFavoritesByAccount error:", error)
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  isFavorited,
  getFavoritesByAccount,
}
