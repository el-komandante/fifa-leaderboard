/* jshint esversion: 6 */
import axios from 'axios';

//Don't forget the 'http://'
const IP_ADDRESS = 'http://localhost:3002';
const instance = axios.create({
  baseURL: IP_ADDRESS,
  timeout: 10000
});

const getUsers = () => {
  return instance.get('/users')
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}

const getUser = (id) => {
  return instance.get(`/users/${id}`)
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}
// Games are returned with the winner_score and loser_score reversed
const getGames = (id) => {
  return instance.get(`/users/${id}/games`)
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}

const submitGame = (game) => {
  instance.post('/games', game)
  .then( response => { return response.data; })
  .catch( error => console.error(error) );
}
export { getUsers, getUser, getGames, submitGame };
