const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1/phoneData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// A function to dynamically create a Mongoose model for a specific brand
function createBrandModel(brand) {
  const scrapedDataSchema = new mongoose.Schema({
    title: String,
    price: String,
  });

  return mongoose.model(`${brand}Data`, scrapedDataSchema);
}

// A function to check if the title contains the phone keyword
function isPhoneItem(title) {
  const keywords = ['phone', 'smartphone', 'mobile', 'cellphone','${brand}']; 
  title = title.toLowerCase();
  return keywords.some(keyword => title.includes(keyword));
}

// A function to scrape data for a specific phone brand and store/update it in the database
async function scrapeAndStoreBrandData(brand) {
  try {
    const targetUrl = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=phones&_sacat=0&LH_TitleDesc=0&_oac=1&Brand=${brand}&_dcat=9355`;
    const response = await axios.get(targetUrl);
    const $ = cheerio.load(response.data);

    const BrandData = createBrandModel(brand);

    const scrapedData = [];

    $('.s-item').each(async (index, element) => {
      const title = $(element).find('.s-item__title').text().trim();
      const price = $(element).find('.s-item__price').text().trim();

      if (!isPhoneItem(title)) {
        // Skip items that are not related to phones
        return;
      }

      // Check if an item with the same title exists in the database
      const existingItem = await BrandData.findOne({ title });

      if (existingItem) {
        // If the item exists, update its price
        existingItem.price = price;
        await existingItem.save();
      } else {
        // If the item does not exist, create a new document and save it
        const newItem = new BrandData({ title, price });
        await newItem.save();
      }

      scrapedData.push({ title, price });
    });

    // Retrieve and return all data after updating
    const allScrapedData = await BrandData.find();
    return allScrapedData;
  } catch (error) {
    console.error(`Error scraping ${brand} data:`, error);
    return null;
  }
}

// Enables CORS
app.use(cors());

// Serves http requests and responses for Apple phones
app.get('/scrape/apple', async (req, res) => {
  const data = await scrapeAndStoreBrandData('Apple');
  if (data) {
    console.log('Scraped and stored Apple Data:', data);
    res.json(data);
  } else {
    res.status(500).send('Failed to scrape and store Apple data');
  }
});

// Serves http requests and responses for Samsung phones
app.get('/scrape/samsung', async (req, res) => {
  const data = await scrapeAndStoreBrandData('Samsung');
  if (data) {
    console.log('Scraped and stored Samsung Data:', data);
    res.json(data);
  } else {
    res.status(500).send('Failed to scrape and store Samsung data');
  }
});

// Serves http requests and responses for Nokia phones
app.get('/scrape/nokia', async (req, res) => {
  const data = await scrapeAndStoreBrandData('Nokia');
  if (data) {
    console.log('Scraped and stored Nokia Data:', data);
    res.json(data);
  } else {
    res.status(500).send('Failed to scrape and store Nokia data');
  }
});

// Serves http requests and responses for retrieving scraped data for a brand
app.get('/data/:brand', async (req, res) => {
  const brand = req.params.brand;
  const BrandData = createBrandModel(brand);

  try {
    const data = await BrandData.find();
    if (data) {
      res.json(data);
    } else {
      res.status(404).send(`No data found for ${brand}`);
    }
  } catch (error) {
    console.error(`Error fetching data for ${brand}:`, error);
    res.status(500).send(`Failed to fetch data for ${brand}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
