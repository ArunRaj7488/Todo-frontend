import axios from 'axios';

const createTodo = (payload) =>  axios.post('http://localhost:8080/todo/create', payload);
const getTodo = () => axios.get('http://localhost:8080/todo/get/All');
const getTodoByQuery = (data) => axios.post('http://localhost:8080/todo/get/by/query', data);
const updateTodo = (id, data) => axios.put(`http://localhost:8080/todo/update/${id}`, data);
const deleteSingleTodo = (id) => axios.delete(`http://localhost:8080/todo/delete/single/${id}`);
const deleteMultipleTodo = (ids) => axios.post(`http://localhost:8080/todo/delete/multiple`, ids);

export default { createTodo, getTodo, getTodoByQuery, updateTodo, deleteSingleTodo, deleteMultipleTodo};