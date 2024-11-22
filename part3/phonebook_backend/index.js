const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/phonebook')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => {
      console.log('Error fetching phonebook:', error)
      response.status(400).send({ error: 'Couldn\'t fetch phonebook' })
    })
})


app.get('/info', (request, response, next) => {
  Person.find({}).then(persons => {
    const personTotal = persons.length
    const dateNow = Date()
    console.log('personTotal:', personTotal)
    response.send(`<p>Phonebook has info for ${personTotal} people</p><p>${dateNow}</p>`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete (request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (name === undefined || number === undefined) {
    return response.status(400).json( { error: 'Name and/or number missing' } )
  }

  Person.find({}).then(persons => {
    if (persons.some(person => person.name === name)) {
      return response.status(400).json( { error: 'Name already in database' } )
    }
  })

  const person = new Person ({
    name: name,
    number: number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number
  }
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send( { error: 'unknown endpoint' } )
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'Casterror') {
    return response.status(400).send( { error: 'malformatted id' } )
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error.message } )
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



// :method :url :status :res[content-length] - :response-time ms

// let persons = [
//   {
//     "id": '1',
//     "name": 'Arto Hellas',
//     "number": '040-123456'
//   },
//   {
//     "id": '2',
//     "name": Ada Lovelace',
//     "number": "39-44-5323523"
//   },
//   {
//     "id": "3",
//     "name": "Dan Abramov",
//     "number": "12-43-234345"
//   },
//   {
//     "id": "4",
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122"
//   }
// ]