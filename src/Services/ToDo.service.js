import axios from "axios";
import ApisEnums from "../enum/api.enum";
const { HOST_URL, ADD, GET, UPDATE, DELETE } = ApisEnums;

const createTodo = (payload) => axios.post(`${HOST_URL}/${ADD}`, payload);

const getTodo = () => axios.get(`${HOST_URL}/${GET}/all`);

const getTodoByQuery = (data) =>
  axios.post(`${HOST_URL}/${GET}/by/query`, data);

const updateTodo = (id, data) => axios.put(`${HOST_URL}/${UPDATE}/${id}`, data);
const updateOnMarked = (data) =>
  axios.post(`${HOST_URL}/${UPDATE}/all-marked`, data);

const deleteSingleTodo = (id) =>
  axios.delete(`${HOST_URL}/${DELETE}/single/${id}`);

const deleteMultipleTodo = (ids) =>
  axios.post(`${HOST_URL}/${DELETE}/multiple`, ids);

const apis = {
  createTodo,
  getTodo,
  getTodoByQuery,
  updateTodo,
  updateOnMarked,
  deleteSingleTodo,
  deleteMultipleTodo,
};
export default apis;
