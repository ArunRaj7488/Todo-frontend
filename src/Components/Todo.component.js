import React, { useEffect, useState } from "react";
import ToDoService from "../Services/ToDo.service";
import "../Styles/Todo.style.css";
import cn from "classnames";

const Todo = () => {
  // Declare a new state variable, which we'll call "count"
  const [todoList, setTodoList] = useState([]);
  const [filter, setFilter] = useState("all");

  // on press enter key add todo data
  const onHandleKeyPress = async (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      await ToDoService.createTodo({ todo: e.target.value })
        .then((res) => {
          if (res["data"]) {
            todoList.push(res["data"]);
            setTodoList([...todoList]);
            // set empty input filed after enter
            e.target.value = "";
          }
        })
        .catch((err) => console.log(err));
    }
  };

  // delete single todo
  const deleteSingleTodo = async (index) => {
    const todo = todoList[index];
    await ToDoService.deleteSingleTodo(todo._id)
      .then((res) => {
        if (res["data"]) {
          todoList.splice(index, 1);
          setTodoList([...todoList]);
        }
      })
      .catch((err) => console.log(err));
  };
  // check todo list and update is completed
  const onCheckedTodo = async (e, index) => {
    const newTodos = [...todoList];
    const todo = newTodos[index];
    todo.completed = !todo.completed;
    setTodoList(newTodos);
    // call update todo service
    await ToDoService.updateTodo(todo["_id"], {
      completed: todo.completed,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  /**
   * get todo list by query
   * all -> {}
   * active -> {completed: false}
   * completed -> { completed: true}
   * @param {*} query ,filter
   */
  const getTodoListByQuery = async (query, filter) => {
    setFilter(filter);
    const result = await ToDoService.getTodoByQuery(query)
      .then((res) => {
        setTodoList(result["data"]);
      })
      .catch((err) => console.log(err));
  };

  // clear All completed todo list
  const clearAllCompletedTodos = async () => {
    const ids = [];
    todoList.reduce((acc, todo) => {
      if (todo.completed) {
        acc.push(todo._id);
        return acc;
      }
      return acc;
    }, ids);
    const newTodos = todoList.filter((todo) => !ids.includes(todo._id));
    setTodoList(newTodos);
    await ToDoService.deleteMultipleTodo(ids)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };

  // check and uncheck all todo list
  const handleOnArrowClicked = (e) => {
    e.preventDefault();
    const newTodos = todoList.map((todo) => ({
      ...todo,
      completed: Boolean(activeTodoCount),
    }));
    setTodoList([...newTodos]);
  };
  // get all todo list
  const getAllTodoList = async () => {
    await ToDoService.getTodo()
      .then((res) => {
        if (res["data"].length > 0) {
          setTodoList(res["data"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllTodoList();
  }, []);

  // get active number todo
  const activeTodoCount = todoList.filter(
    (todo) => !todo["completed"] === true
  ).length;

  // get flag showFooter , show on footer based on that
  const showFooter =
    (todoList.length > 0 && filter === "all") ||
    filter === "active" ||
    filter === "completed"
      ? true
      : false;

  const actionButtons = [
    { title: "All", id: "all", cond: {} },
    { title: "Active", id: "active", cond: { completed: false } },
    { title: "Completed", id: "completed", cond: { completed: true } },
  ];
  return (
    <section className="todo-body">
      <header>
        <h1 className="title">todos</h1>
        <div className="top-wrapper">
          <section
            onClick={handleOnArrowClicked}
            className={cn({
              arrow: todoList.length > 0,
              "no-arrow": todoList.length === 0,
              "checked-all": Boolean(activeTodoCount) === false,
              "no-checked": Boolean(activeTodoCount) === true,
            })}
          ></section>
          <input
            className="input-add-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyPress={(e) => onHandleKeyPress(e)}
          />
        </div>
        <ul className="todo-list">
          {todoList &&
            todoList.map((value, index) => (
              <li
                className={cn({
                  completed: value.completed,
                })}
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
                  <label>{value.todo}</label>{" "}
                  <button
                    className="destroy"
                    onClick={() => deleteSingleTodo(index)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </header>
      {showFooter && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeTodoCount}</strong> item
            {activeTodoCount === 1 ? "" : "s"} left
          </span>
          {actionButtons.map((item) => (
            <button
              className={cn({
                selected: filter === item.id,
                "btn-border": true,
              })}
              onClick={() => getTodoListByQuery(item.cond, item.id)}
            >
              {item.title}
            </button>
          ))}
          {activeTodoCount < todoList.length && (
            <button
              onClick={clearAllCompletedTodos}
              className="clear-completed"
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </section>
  );
};

export default Todo;
