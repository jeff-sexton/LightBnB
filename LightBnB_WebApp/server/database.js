require('dotenv').config(); // Add DB environment variables

const user = process.env.DB_USER || 'vagrant';
const password = process.env.DB_PASSWORD || '123';
const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_DATABASE || 'lightbnb';

const { Pool } = require('pg');
const pool = new Pool({
  user,
  password,
  host,
  database
});

pool.connect(err => {
  if (err) throw err;
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1;
  `, [email])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch(err => {
      throw err;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1;
  `, [id])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch(err => {
      throw err;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, password, email)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.password, user.email])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch(err => {
      throw err;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  return pool.query(`
  SELECT properties.*,
  reservations.*,
  AVG(rating) AS average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews on properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guestId, limit])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows;
    })
    .catch(err => {
      throw err;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  const buildWhereBasedOnParamLength = (params) => {
    if (params.length > 1) {
      return `
      AND `;
    } else {
      return `
      WHERE `;
    }

  };

  const queryParams = [];

  let queryString = `
      SELECT properties.*,
      AVG(rating) AS average_rating
      FROM properties
      JOIN property_reviews ON property_id = properties.id`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `
      WHERE city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += buildWhereBasedOnParamLength(queryParams);
    queryString += `owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night * 100));
    queryString += buildWhereBasedOnParamLength(queryParams);
    queryString += `cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night * 100));
    queryString += buildWhereBasedOnParamLength(queryParams);
    queryString += `cost_per_night <= $${queryParams.length}`;
  }

  queryString += `
      GROUP BY properties.id`;

  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `
      HAVING AVG(rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;

  return pool.query(queryString, queryParams)
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows;
    })
    .catch(err => {
      throw err;
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    Math.round(Number(property.cost_per_night) * 100),
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return pool.query(`
  INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
    )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
    )
  RETURNING *;
  `, queryParams)
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0];
    })
    .catch(err => {
      throw err;
    });
};
exports.addProperty = addProperty;