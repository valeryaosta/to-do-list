import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, tasksReducer, changeTaskTitleAC} from "./state/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithReducers() {

    function removeTask(id: string, TodolistId: string) {
        dispatchTasksReducer(removeTaskAC(id, TodolistId))
    }

    function addTask(title: string, TodolistId: string) {
        dispatchTasksReducer(addTaskAC(title, TodolistId))
    }

    function changeStatus(taskID: string, isDone: boolean, TodoListId: string) {
        dispatchTasksReducer(changeTaskStatusAC(taskID, isDone, TodoListId))
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        dispatchTodolistsReducer(ChangeTodolistFilterAC(value, todoListId))
    }

    function removeTodoList(TodoListId: string) {
        dispatchTodolistsReducer(RemoveTodolistAC(TodoListId))
        dispatchTasksReducer(RemoveTodolistAC(TodoListId))
    }

    function changeTodolistTitle(id: string, newTitle: string) {
        dispatchTodolistsReducer(ChangeTodolistTitleAC(id, newTitle))
    }

    function changeTaskTitle(taskID: string, newTitle: string, TodoListId: string) {
        dispatchTasksReducer(changeTaskTitleAC(taskID, newTitle, TodoListId))
    }

    const TodoListId1 = v1();
    const TodoListId2 = v1();

    let [TodoLists, dispatchTodolistsReducer] = useReducer(todolistsReducer,[
        {id: TodoListId1, title: "What to learn", filter: "all"},
        {id: TodoListId2, title: "What to buy", filter: "all"}
    ])

    let [tasksObj, dispatchTasksReducer] = useReducer(tasksReducer, {
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
        const action = AddTodolistAC(title);
        dispatchTasksReducer(action);
        dispatchTodolistsReducer(action);
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

export default AppWithReducers;
