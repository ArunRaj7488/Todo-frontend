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
      let todoData = await ToDoService.createTodo({ todo: e.target.value });
      setTodo(todoData);
      // set empty input filed after enter
      e.target.value = ''    }
  };

  // get all to todo list
  const getAllTodolist = async () => {
    let todoList = await ToDoService.getTodo();
    return todoList;
  };
  // delete single todo
  const deleteSingleTodo = async (id) => {
    let result = await ToDoService.deleteSingleTodo(id);
    setDeleteTodo([result["data"]]);
  };
  // check todo list
  const onCheckedTodo = async (e, todo) => {
    let status = todo["completed"] === false ? true : false;
    // call update todo srvice
    let update = await ToDoService.updateTodo(todo["_id"], {
      completed: status,
    });
    setDeleteTodo([status])
    setCompleted(status);
    // check todo list id add in array list for deleteing todos use
    let checkIndex = ids.indexOf(todo["_id"]);
    if (checkIndex === -1) {
        ids.push(todo["_id"]);
    } else {
        ids.splice(checkIndex, 1);
    }
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
    setTodoList(result["data"]);
  };

  // cleare All completed todolist
  const clearAllCompletedTodos = async () => {
    let result = await ToDoService.deleteMultipleTodo(ids);
    setDeleteTodo([result["data"]]);
  };

  useEffect(async () => {
    let mounted = true;
    getAllTodolist().then((res) => {
      if (mounted) {
        console.log({ res });
        // get completed todo list Ids for cleare todo
    res["data"].map(item => {
            if(item.completed === true){
                ids.push(item._id)
            }
        });
        setTodoList(res["data"]);
      }
      return () => (mounted = false);
    });
  }, [todo, deleteTodo, completed]);

  const activeTodoCount = todoList.filter(
    (todo) => !todo["completed"] === true
  ).length;
  console.log({ activeTodoCount });
  const allCompleted = todoList.length > 0 && activeTodoCount === 0;
  console.log({ allCompleted });
  const mark = !allCompleted ? "completed" : "active";
  console.log( {filter});
  const getFooter = (todoList.length > 0 && filter === "all") || (filter ==="active") || (filter === 'completed') ? true : false;
  console.log({getFooter});
  return (
    <section className="todo-body">
      <header>
        <h1 className="title">todos</h1>
        <input
          className="input-add-todo"
          placeholder="What needs to be done?"
            // value={todo}
          autoFocus
          onKeyPress={(e) => onHaldeKeyPress(e)}
        />
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
                    onChange={(e) => onCheckedTodo(e, value)}
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
                    onClick={() => deleteSingleTodo(value._id)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </header>
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onChange={(e) => {
            console.log({ e });
          }}
          checked={allCompleted}
        />
        <label htmlFor="toggle-all" title={`Mark all as ${mark}`}>
          Mark all as {mark}
        </label>
      </section>
      { getFooter && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeTodoCount}</strong> item
            {activeTodoCount === 1 ? "" : "s"} left
          </span>
          <ul className="filters">
            <li>
              <button
                className={cn({
                  selected: filter === "all"
                })}
                onClick={() => getTodoListByQury({}, 'all')}
              >
                All
              </button>
            </li>
            <li>
              <button
                className={cn({
                  selected: filter === "active"
                })}
                onClick={() => getTodoListByQury({completed: false}, 'active')}
              >
                Active
              </button>
            </li>
            <li>
              <button
                className={cn({
                  selected: filter == 'completed',
                })}
                className
                onClick={() => getTodoListByQury({completed: true}, 'completed')}
              >
                Completed
              </button>
            </li>
          </ul>
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
