import React, { useEffect, useState } from "react";
import "../Styles/Todo.style.css";
import ToDoService from "../Services/ToDo.service";
import cn from "classnames";
const ids = [];
const Todo = () => {
  // Declare a new state variable, which we'll call "count"
  let [todo, setTodo] = useState("");
  let [todoList, setTodoList] = useState([]);
  let [deleteTodo, setDeleteTodo] = useState([]);
  let [completed, setCompleted] = useState(false);
  let [filter, setFilter] = useState("all")
  // on press enter key add todo data
  const onHaldeKeyPress = async (e) => {
    if (e.key === "Enter") {
      let {data} = await ToDoService.createTodo({ todo: e.target.value });
      setTodo(data)
      todoList.push(data)
      setTodoList([...todoList])
      // set empty input filed after enter
      e.target.value = ''
    }
  };

  // get all to todo list
  const getAllTodolist = async () => {
    let todoList = await ToDoService.getTodo();
    return todoList;
  };
  // delete single todo
  const deleteSingleTodo = async (index) => {
    const todo = todoList[index]
    let result = await ToDoService.deleteSingleTodo(todo._id)
    todoList.splice(index, 1)
    setTodoList([...todoList])
  };
  // check todo list
  const onCheckedTodo = async (e, index) => {
    const newTodos = [...todoList]
    const todo = newTodos[index]
    todo.completed = !todo.completed
    setTodoList(newTodos)
    // call update todo srvice
    let update = await ToDoService.updateTodo(todo["_id"], {
      completed: todo.completed
    })
  };
 
  /**
   * get todolist by query 
   * all -> {}
   * active -> {completed: flase}
   * completed -> { completed: true}
   * @param {*} query 
   */
  const getTodoListByQury = async (query, filter) => {
    setFilter(filter)
    let result = await ToDoService.getTodoByQuery(query);
    setTodoList(result["data"])
  };

  // cleare All completed todolist
  const clearAllCompletedTodos = async () => {
    const ids = []
    todoList.reduce((acc, todo) => {
      if(todo.completed) {
        acc.push(todo._id)
        return acc
      }
      return acc
    }, ids)
    const newTodos = todoList.filter(todo => !ids.includes(todo._id))
    setTodoList(newTodos)
    let result = await ToDoService.deleteMultipleTodo(ids);
  };

  const handleOnArrowClicked = (e) => {
    e.preventDefault()
    const newTodos = todoList.map(todo => ({
      ...todo,
      completed: Boolean(activeTodoCount)
    }))
    setTodoList([...newTodos])
  }

  useEffect(async () => {
    let mounted = true;
    getAllTodolist().then((res) => {
      if (mounted) {
        // get completed todo list Ids for cleare todo
        setTodoList(res["data"]);
      }
      return () => (mounted = false);
    }).catch(err => {
      
    });
  }, [])

  const activeTodoCount = todoList.filter((todo) => !todo["completed"] === true).length;
  const allCompleted = todoList.length > 0 && activeTodoCount === 0;
  const mark = !allCompleted ? "completed" : "active";
  const getFooter = (todoList.length > 0 && filter === "all") || (filter ==="active") || (filter === 'completed') ? true : false;

  const actionButtons = [{title: 'All', id: 'all', cond: {}}, {title: 'Active', id: 'active', cond: {completed: false}}, {title: 'Completed', id: 'completed', cond: {completed: true}}]
  return (
    <section className="todo-body">
      <header>
        <h1 className="title">todos</h1>
        <div className='top-wrapper'>
        <section onClick={handleOnArrowClicked} className={todoList.length ? 'arrow': 'no-arrow'}></section>
          <input
            className="input-add-todo"
            placeholder="What needs to be done?"
              // value={todo}
            autoFocus
            onKeyPress={(e) => onHaldeKeyPress(e)}
          />
        </div>
        <ul className="todo-list">
          {todoList &&
            todoList.map((value, index) => (
              <li
                className={cn({
                  // editing: state.matches("editing"),
                  completed: value.completed,
                })}
                 data-todo-state={value.completed === true ? "completed" : "active"}
                key={index}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    onChange={(e) => onCheckedTodo(e, index)}
                    value={value?.completed}
                    checked={value?.completed}
                  />
                  <label
                  //   onDoubleClick={(e) => {
                  //     send("EDIT");
                  //   }}
                  >
                    {value.todo}
                  </label>{" "}
                  <button
                    className="destroy"
                    onClick={() => deleteSingleTodo(index)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </header>
      { getFooter && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeTodoCount}</strong> item
            {activeTodoCount === 1 ? "" : "s"} left
          </span>
          {actionButtons.map(item => (
            <button
              className={cn({
                selected: filter === item.id,
                'btn-border': true
              })}
              onClick={() => getTodoListByQury(item.cond, item.id)}
            >
              {item.title}
            </button>
          ))}
          {activeTodoCount < todoList.length && (
            <button onClick={clearAllCompletedTodos} className="clear-completed">
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default Todo;
