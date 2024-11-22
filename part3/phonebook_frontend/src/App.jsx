import { useEffect, useState } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'


const Notification = ({ message }) => {
  const errorStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 24,
    fontStyle: 'bold',
    borderStyle: 20,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) return null
  else return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const Filter = ({ searchInput, newSearch }) => {
  return (
    <div>
      filter shown with <input onChange={ searchInput } value={ newSearch } />
    </div>

  )
}

const PersonsForm = ({ formSubmit, nameInput, newName, numberInput, newNumber }) => {
  return (
    <form onSubmit={ formSubmit } >
      <div>name: <input onChange={ nameInput } value={ newName } /></div>
      <div>number: <input onChange={ numberInput } value={ newNumber } /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ searchPersons, removePerson }) =>
  <>
    {searchPersons.map(person =>
      <Person key={person.id} person={person} removePerson={removePerson} />
    )}
  </>

const Person = ({ person, removePerson }) => {

  const handleDelete = () => {
    console.log("Delete button clicked for:", person.name);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
      .deleteEntry(person.id)
      .then(deleted => {
        console.log(`Deleted entry for ${person.name}`)
        // Create new function here to send back through the chain
        removePerson(person.id)
      })
      .catch(error => console.log(`Error deleting ${person.name}`, error))
    }
  }
  const noteStyle = {
    color: 'grey',
    padding: 3
  }

  return (
    <div style={noteStyle}>
      {person.name}: {person.number} <button onClick={handleDelete}>delete</button>
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)

  // Fetch data from backend with axios
  useEffect(() => {
    phonebookService
      .getAll()
      .then(currentPhonebook => {
        setPersons(currentPhonebook)
      })
      .catch(error => console.log('Error fetching data:', error))
  }, [])


  const formSubmit = (event) => {
    event.preventDefault()

    const existingUser = persons.find(person => person.name.toLowerCase().trim() === newName.toLowerCase().trim())
    if (existingUser && existingUser.number !== newNumber) {
      const confirmed = window.confirm(`Confirm update of ${existingUser.name}'s number to '${newNumber}' ?`)
      if (confirmed) {
        // Get id to send and create newObj
        const userId = existingUser.id
        const newObj = {
          ...existingUser,
          number: newNumber
        }
        console.log("newObJ:", newObj)

        phonebookService
          .update(userId, newObj)
          .then(updatedEntry => {
            setPersons(persons.map(person => person.id !== userId ? person : updatedEntry))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log(`Error updating ${newName}`, error)
            setMessage(`Information on ${newName} has already been removed from the server`)
            setTimeout(() => setMessage(null), 4000)
        })
      }
    }

    else if (existingUser && existingUser.name === newName.toLowerCase().trim()) {
      alert(`${newName} already in database`)
      setNewName('')
      setNewNumber('')
    }
    else if (newName === '' || newNumber === '') {
      alert("Please complete both input fields")
    }
    else {
      const personObj = {
        name: newName,
        number: newNumber
      }

      phonebookService
        .create(personObj)
        .then(newEntry => {
          setPersons(persons.concat(newEntry))
          console.log("New Entry:", newEntry)
          setMessage(`Added ${newEntry.name} to phonebook`)
          setTimeout(() => setMessage(null), 3000)
        })
        .catch(error => {
          if (error.response.data.error.includes('is shorter than the minimum allowed')) {
            setMessage(`Person validation failed: name: Path ${personObj.name} is shorter than the minimum allowed length`)
          }
          else if (error.response.data.error.includes('is not a valid phone number')) {
            setMessage(`Person validation failed: number ${personObj.number} is not a valid format. Please use ###-###-####`)
          }
          else {
            setMessage('Person validation failed:', error.response.data.error)
          }
          console.log(`Error adding ${newName}:`, error.response.data.error)
        })

      setNewName('')
      setNewNumber('')
    }
  }

  const nameInput = (event) => {
    setNewName(event.target.value)
  }

  const numberInput = (event) => {
    setNewNumber(event.target.value)
  }

  // Search box
  const searchInput = (event) => {
    setNewSearch(event.target.value)
  }
  const searchPersons = persons.filter(person => 
    person.name.toLowerCase().trim().includes(newSearch.toLowerCase().trim()))

  const removePerson = (id) => {
    setPersons(persons.filter(person => person.id !== id))
  }

  const titleStyle = {
    color: 'green',
    fontStyle: 'italic'
  }

  return (
    <div>
      <h2 style={titleStyle}>Phonebook</h2>
      <Notification message={message} />
      <Filter searchInput={ searchInput } newSearch={ newSearch } /> 
      <h2>add a new</h2>
      <PersonsForm
        formSubmit={ formSubmit }
        nameInput={ nameInput }
        newName={ newName }
        numberInput={ numberInput }
        newNumber={ newNumber }
      />
      <h2>Numbers</h2>
      <Persons searchPersons={searchPersons} removePerson={removePerson} />
    </div>
  )
}

export default App