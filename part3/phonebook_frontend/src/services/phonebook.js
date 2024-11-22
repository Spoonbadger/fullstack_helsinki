import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (personObj) => {
    const request = axios.post(baseUrl, personObj)
    return request.then(response => response.data)
}

const deleteEntry = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (id, updatedObj) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedObj)
    return request.then(response => response.data)
}


export default { getAll, create, deleteEntry, update }