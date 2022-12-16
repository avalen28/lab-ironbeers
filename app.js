const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      res.render('beers', { beersFromApi });
    })
    .catch(error => console.log(error));
});

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(randomBeerFromApi => {
      res.render('random-beer', randomBeerFromApi[0]);
    })
    .catch(error => console.log(error));
});

app.get('/beers/:beerId', (req, res) => {
  // el beerId será el que cuando cliquemos en la imagen, esta lo escribirá en la URL
  const id = req.params.beerId.replace('beer-', ''); // cogemos el parametro de la request y le quitamos todo lo que no es el id en si
  punkAPI
    .getBeer(id)
    .then(individualBeer => res.render('individual-beer', individualBeer[0])) // nos quedamos con la posición 0 porque viene en un array aunque sea solo uno
    .catch(err => console.log(err));
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
