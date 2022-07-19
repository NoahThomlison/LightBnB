# LightBnB

## Project Summary

LightBNB is an Lighthouse Labs AirBNB clone. It is built using SASS, JS, Express, and PostgreSQL. Users can view properties, rent properties, add properties and review properties. They can also search properties by price, location or rating.

![](LightBNB.gif)

## Setup

Install dependencies with `npm install`.

### Dependencies
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cookie-session": "^1.4.0",
    "express": "^4.17.1",
    "nodemon": "^1.19.4",
    "pg": "^8.7.1"
    
## Running Webpack Development Server
```sh
npm run local
```

## Running SASS Updates
```sh
npm run sass
```

## Running PSQL
login to psql and use the following command:
```sh
psql -h localhost -p 5432 -U vagrant lightbnb
```
password: 123

