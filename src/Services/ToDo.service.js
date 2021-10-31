import axios from "axios";
const url = "http://localhost:8080/todo";

const createTodo = (payload) => axios.post(`${url}/create`, payload);

const getTodo = () => axios.get(`${url}/get/all`);

const getTodoByQuery = (data) => axios.post(`${url}/get/by/query`, data);

const updateTodo = (id, data) => axios.put(`${url}/update/${id}`, data);

const deleteSingleTodo = (id) => axios.delete(`${url}/delete/single/${id}`);

const deleteMultipleTodo = (ids) => axios.post(`${url}/delete/multiple`, ids);

export default {
  createTodo,
  getTodo,
  getTodoByQuery,
  updateTodo,
  deleteSingleTodo,
  deleteMultipleTodo,
};
