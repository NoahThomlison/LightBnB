-- \i 1_queries/AllMyReservations.sql

SELECT reservations.*, properties.*, avg(property_reviews.rating) AS average_rating
FROM reservations
JOIN properties on properties.id = reservations.property_id
JOIN property_reviews on reservations.id = property_reviews.reservation_id
WHERE reservations.guest_id = '1' AND (reservations.end_date < now()::date)
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10