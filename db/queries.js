// lib/queries.js
const pool = require('./db');

// Add a new school
const addSchool = async (name, address, latitude, longitude) => {
  const query = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [name, address, latitude, longitude];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Fetch all schools and calculate distances
const getSchoolsSortedByProximity = async (userLat, userLng) => {
  const result = await pool.query('SELECT * FROM schools');
  const schools = result.rows;

  const toRadians = (deg) => deg * (Math.PI / 180);
  const earthRadiusKm = 6371;

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  };

  const schoolsWithDistance = schools.map((school) => ({
    ...school,
    distance: calculateDistance(userLat, userLng, school.latitude, school.longitude),
  }));

  return schoolsWithDistance.sort((a, b) => a.distance - b.distance);
};

module.exports = {
  addSchool,
  getSchoolsSortedByProximity
};
