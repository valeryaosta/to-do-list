import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TaskStateType = {
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
        let task = {id: v1(), title: title, isDone: false};
        let tasks = tasksObj[TodolistId];
        let newTasks = [task, ...tasks];
        tasksObj[TodolistId] = newTasks;
        setTasks({...tasksObj});
    }

    function changeStatus(taskID: string, isDone: boolean, TodoListId: string) {
        let tasks = tasksObj[TodoListId];
        let task = tasks.find(t => t.id === taskID)
        if (task) {
            task.isDone = isDone;
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

    let [TodoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: TodoListId1, title: "What to learn", filter: "all"},
        {id: TodoListId2, title: "What to buy", filter: "all"}
    ])

    let [tasksObj, setTasks] = useState<TaskStateType>({
        [TodoListId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [TodoListId2]: [
            {id: v1(), title: "Bread", isDone: false},
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Eggs", isDone: true},
            {id: v1(), title: "Fruits", isDone: false},
        ],
    })

    function addTodolist(title: string) {
        let todolist: TodoListType = {
            id: v1(),
            title: title,
            filter: "all"
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
                                tasksForTodoList = tasksObj[tl.id].filter(t => t.isDone === false);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodoList = tasksObj[tl.id].filter(t => t.isDone === true);
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
