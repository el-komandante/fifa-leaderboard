/* jshint esversion: 6 */
import axios from 'axios';

//Don't forget the 'http://'
const IP_ADDRESS = 'http://192.168.0.105:3002';
const instance = axios.create({
  baseURL: IP_ADDRESS,
  timeout: 10000
});

function getUsers () {
  return instance.get('/users')
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}

function getUser (id) {
  return instance.get(`/users/${id}`)
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}
// Games are returned with the winner_score and loser_score reversed
function getGames (id) {
  return instance.get(`/users/${id}/games`)
  .then( response => { return response.data; } )
  .catch( error => console.error(error) );
}

function submitGame (game) {
  instance.post('/games', game)
  .then( response => { return response.data; })
  .catch( error => console.error(error) );
}
export { getUsers, getUser, getGames, submitGame };
