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

  // Ingevulde input door de user via URL
  const search = request.query.search
  const min = request.query.min
  const max = request.query.max

  // Haal alle producten op uit de API door een object te maken
  const productParams = {
    'sort': 'name'
  }

  // Zoekbalk op naam en alles wat in de naam zit
  if (search) {
    productParams['filter[name][_contains]'] = search
  }

  // Minimaal en maximaal bedrag filter
  if (min) {
    productParams['filter[amount][_gte]'] = min
  }

  if (max) {
    productParams['filter[amount][_lte]'] = max
  }

  // Productdata ophalen met Directus API van Milledoni en filters meesturen
  const productResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_products?' +
    new URLSearchParams(productParams)
  )

  // Zet response om naar json voor server
  const productResponseJSON = await productResponse.json()
  // Alleen de lijst met producten uit API
  const productData = productResponseJSON.data

  // Userdata van mijzelf ophalen met alle gekoppelde data
  const userResponse = await fetch(
    'https://fdnd-agency.directus.app/items/milledoni_users/64?fields=*.*'
  )

  // Zet response om naar json voor server
  const userData = await userResponse.json()
  // Aantal gelikete producten van de user(ikzelf)
  const likedCount = userData.data.liked_products.length

  response.render('index.liquid', {
    products: productData,
    likedCount: likedCount,
    status: request.query.status
  })
})

// HOME PRODUCT OPSLAAN IN
app.post("/product-opslaan", async function (request, response) {
  await fetch("https://fdnd-agency.directus.app/items/milledoni_users_milledoni_products_1", {
    method: "POST",
    body: JSON.stringify({
      milledoni_users_id: 64,
      milledoni_products_id: request.body.productId,
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  return response.redirect('/?status=success')
});

// LIJSTENPAGINA
app.get('/lijsten', async function (request, response){

  // Haal alle producten op uit de API door een object te maken
  const listParams = {
  // Sorteer op naam A - Z
    // 'sort': 'name',
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
    status: request.query.status
  })
})

// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post('/lijsten', async function (request, response) {

  const name = request.body.name
  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  try {
    
    if (!name || name.trim() === '') {
      return response.redirect('/lijsten?status=error')
    }

    const fetchResponse = await fetch(
      'https://fdnd-agency.directus.app/items/milledoni_lists?', {
      method: 'POST',
      body: JSON.stringify({
        name: request.body.name,
        age: request.body.age,
        description: request.body.description
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  return response.redirect('/lijsten?status=success')

  } catch (error) {
    console.error(error)
    return response.redirect('/lijsten?status=error')
  }
})



// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Daarna kun je via http://localhost:${app.get('port')}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`)
})
