import express from 'express'

import { Liquid } from 'liquidjs';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

// HOME/PRODUCTENOVERZICHT
app.get('/', async function (request, response) {
  console.log('Route / wordt aangeroepen')

  // Haal het geen wat ingevroerd wordt in de searchbar op
  const search = request.query.search
  const min = request.query.min
  const max = request.query.max

  // Haal alle producten op uit de API door een object te maken
  const productParams = {
    // Sorteer op naam A - Z
    'sort': 'name'
  }

  // ZOEKBALK
  if (search) {
    // Voeg een filter toe aan de API query
    // Directus zoekt dan producten waarvan de naam de zoekterm bevat
    // _contains betekent: tekst komt ergens in de naam voor
    productParams['filter[name][_contains]'] = search
  }

  // MINIMAAL EN MAXIMAAL BEDRAG FILTER
  if (min) {
    productParams['filter[amount][_gte]'] = min
  }

  if (max) {
    productParams['filter[amount][_lte]'] = max
  }

  // Fetch request naar de Directus API
  // Data ophalen met de API van Milledoni
  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(productParams)
  )

  // CHECK OF API WERKT
  // console.log(productResponse.status)

  const productResponseJSON = await productResponse.json()
  // CHECK VOOR JSON DATA
  console.log(productResponseJSON)

  // Haalt lijst met de producten eruit
  const productData = productResponseJSON.data

  response.render('index.liquid', {
    products: productData,
    currentPath: request.path
  })
})

// LIJSTENPAGINA
app.get('/lijsten', async function (request, response){

  // Haal alle producten op uit de API door een object te maken
  const listParams = {
  // Sorteer op naam A - Z
    'sort': 'name',
  }

  const listResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_lists?' +
    new URLSearchParams(listParams)
  )
  // console.log(listResponse.status)

  const listResponseJSON = await listResponse.json()
  const listData = listResponseJSON.data
 console.log(listData)

  response.render('lijst.liquid', {
    lists: listData,
    currentPath: request.path
  })
})

/*
// Zie https://expressjs.com/en/5x/api.html#app.get.method over app.get()
app.get(…, async function (request, response) {
  
  // Zie https://expressjs.com/en/5x/api.html#res.render over response.render()
  response.render(…)
})
*/

// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post('/lijsten', async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  const fetchResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_lists?', {
    method: 'POST',
    body: JSON.stringify({
      name: request.body.name,
      id: request.body.id
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  // const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, '/lijsten')
})



// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
