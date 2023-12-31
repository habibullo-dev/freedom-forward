const MONGODB_URI = 'mongodb+srv://habibullochutboev:toby_2003@hope4palestine.mtasviw.mongodb.net/?retryWrites=true&w=majority'
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');


const app = express();
const port = 4000;

const Schema = mongoose.Schema;
const uri = MONGODB_URI;

const palestineBrands = [];
const palestineCountries = [];
const israelBrands = [];
const israelCountries = [];
const boycotts = [];

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB...');

    // Define a schema
    const countrySchema = new Schema({
      id: Number,
      country: String,
      image_link: String,
      news: {
        title: String,
        brief: String,
        detailed: String
      },
      reference: String
    });

    const brandSchema = new Schema({
      id: Number,
      brand: String,
      image_link: String,
      news: {
        title: String,
        brief: String,
        detailed: String
      },
      reference: String
    });

    const boycottSchema = new Schema({
      id: Number,
      name: String,
      image: String,
      location: String,
      news: {
        title: String,
        brief: String,
        detailed: String
      },
      reference: String
    });


    // Define models for each type
    const PalestineCountry = mongoose.model('palestinecountries', countrySchema);
    const PalestineBrand = mongoose.model('palestinebrands', brandSchema);
    const IsraelCountry = mongoose.model('israelcountries', countrySchema);
    const IsraelBrand = mongoose.model('israelbrands', brandSchema);
    const BoycottedBrand = mongoose.model('boycottedbrands', boycottSchema);

    // Fetch data from each collection and start the server
    Promise.all([
      PalestineCountry.find(),
      PalestineBrand.find(),
      IsraelCountry.find(),
      IsraelBrand.find(),
      BoycottedBrand.find()
    ])
      .then(([pcountries, pbrands, icountries, ibrands, boycott]) => {
        palestineCountries.push(...pcountries);
        palestineBrands.push(...pbrands);
        israelCountries.push(...icountries);
        israelBrands.push(...ibrands);
        boycotts.push(...boycott);

        // Start the server
        app.use(express.static(path.join(__dirname, '.')));

        // Create an API endpoint for the data
        app.get('/api/data', (req, res) => {
          res.json({
            palestineCountries,
            palestineBrands,
            israelCountries,
            israelBrands,
            boycotts
          });
        });

        app.listen(port, () => {
          console.log(`Server is running at http://localhost:${port}`);
        });
      })
      .catch(err => console.error('Could not connect to MongoDB...', err));
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));