import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType, TodoListDomainType} from "./state/todolists-reducer";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    function removeTask(id: string, TodolistId: string) {
        let tasks = tasksObj[TodolistId];
        let filteredTasks = tasks.filter(t => t.id !== id);
        tasksObj[TodolistId] = filteredTasks;
        setTasks({...tasksObj});
    }

    function addTask(title: string, TodolistId: string) {
        let task = {
            id: v1(), title: title, status: TaskStatuses.New,
            todoListId: TodolistId, startDate: "", deadline: "", addedDate: "",
            order: 0, priority: TaskPriorities.Low, description: ""
        };
        let tasks = tasksObj[TodolistId];
        let newTasks = [task, ...tasks];
        tasksObj[TodolistId] = newTasks;
        setTasks({...tasksObj});
    }

    function changeStatus(taskID: string, status: TaskStatuses, TodoListId: string) {
        let tasks = tasksObj[TodoListId];
        let task = tasks.find(t => t.id === taskID)
        if (task) {
            task.status = status;
            setTasks({...tasksObj})
        }
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        let TodoList = TodoLists.find(tl => tl.id === todoListId)
        if (TodoList) {
            TodoList.filter = value
            setTodoLists([...TodoLists])
        }
    }

    function removeTodoList(TodoListId: string) {
        setTodoLists(TodoLists.filter(tl => tl.id !== TodoListId));
        delete tasksObj[TodoListId];
        setTasks({...tasksObj})
    }

    function changeTodolistTitle(id: string, newTitle: string) {
        const todolist = TodoLists.find(tl => tl.id === id);
        if (todolist) {
            todolist.title = newTitle;
            setTodoLists([...TodoLists])
        }
    }

    function changeTaskTitle(taskID: string, newTitle: string, TodoListId: string) {
        let tasks = tasksObj[TodoListId];
        let task = tasks.find(t => t.id === taskID)
        if (task) {
            task.title = newTitle;
            setTasks({...tasksObj})
        }
    }

    const TodoListId1 = v1();
    const TodoListId2 = v1();

    let [TodoLists, setTodoLists] = useState<Array<TodoListDomainType>>([
        {id: TodoListId1, title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: TodoListId2, title: "What to buy", filter: "all", addedDate: '', order: 0}
    ])

    let [tasksObj, setTasks] = useState<TaskStateType>({
        [TodoListId1]: [
            {
                id: v1(), title: "Javascript", status: TaskStatuses.Completed,
                todoListId: TodoListId1, startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            },
            {
                id: v1(), title: "React-Redux", status: TaskStatuses.Completed,
                todoListId: TodoListId1, startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            }
        ],
        [TodoListId2]: [
            {
                id: v1(), title: "Bread", status: TaskStatuses.Completed,
                todoListId: TodoListId2, startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            },
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed,
                todoListId: TodoListId2, startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            },
        ],
    })

    function addTodolist(title: string) {
        let todolist: TodoListDomainType = {
            id: v1(),
            title: title,
            filter: "all",
            addedDate: "",
            order: 0
        };
        setTodoLists([todolist, ...TodoLists]);
        setTasks({
            ...tasksObj,
            [todolist.id]: []
        })
    }

    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "10px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={4}>
                    {
                        TodoLists.map((tl) => {
                            let tasksForTodoList = tasksObj[tl.id];

                            if (tl.filter === "active") {
                                tasksForTodoList = tasksObj[tl.id].filter(t => t.status === TaskStatuses.New);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodoList = tasksObj[tl.id].filter(t => t.status === TaskStatuses.Completed);
                            }

                            return <Grid item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist key={tl.id}
                                              id={tl.id}
                                              title={tl.title}
                                              tasks={tasksForTodoList}
                                              removeTask={removeTask}
                                              changeFilter={changeFilter}
                                              addTask={addTask}
                                              changeTaskStatus={changeStatus}
                                              filter={tl.filter}
                                              removeTodoList={removeTodoList}
                                              changeTaskTitle={changeTaskTitle}
                                              changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>

        </div>
    );
}

export default App;
