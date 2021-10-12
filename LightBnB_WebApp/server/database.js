const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg')

/// Users
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

//  $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.
//  Accepts an email address and will return a promise.
//  The promise should resolve with the user that has that email address, or null if that user does not exist.

const getUserWithEmail = function(email) {
  const promise = pool
  .query(
    `SELECT * FROM users
    WHERE email = $1`,
    [ email ])
  .then((res) => {
    if(!res.rows.length){
      return(null)
    }
    return res.rows[0];
    })
  .catch((err) => {
    console.log(err.message);
    });

  return promise;
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const promise = pool
  .query(
    `SELECT * FROM users
    WHERE id = $1`,
    [ id ])
  .then((res) => {
    if(!res.rows.length){
      return(null)
    }
    return res.rows[0];
    })
  .catch((err) => {
    console.log(err.message);
    });

  return promise;
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const promise = pool
  .query("INSERT INTO users (name, email, password) \
  VALUES ($1, $2, $3)",
    [ user.name, user.email, user.password ])
  .then((res) => {
    if(!res.rows.length){
      return(null)
    }
    return res.rows[0];
    })
  .catch((err) => {
    console.log(err.message);
    });

  return promise;
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const promise = pool
  .query(
    "SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2", [ guest_id, limit])
    .then(res => {
      return res.rows
    })
    .catch(err => {
      console.log(err)
    })

  return promise
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = 
  "SELECT properties.*, AVG(property_reviews.rating) AS average_rating\
  FROM properties\
  JOIN property_reviews ON properties.id = property_reviews.property_id"

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString +=  `WHERE owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);

    queryString += ` WHERE properties.cost_per_night > $${queryParams.length-1} AND properties.cost_per_night < $${queryParams.length}`;
  }

  queryString += ' GROUP BY properties.id'

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(
      queryString,
      queryParams)
    .then((result) => {
      return result.rows;
      })
    .catch((err) => {
      console.log(err.message);
      });
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
