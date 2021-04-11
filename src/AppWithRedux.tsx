import React, {useCallback} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodolistTitleAC,
    RemoveTodolistAC,
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, removeTaskAC, changeTaskTitleAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    console.log("App is called")
    const todolists = useSelector<AppRootState, Array<TodoListType>>( state =>state.todolists );
    const tasks = useSelector<AppRootState, TaskStateType>( state =>state.tasks );

    const dispatch = useDispatch();

    const removeTask = useCallback((id: string, TodolistId: string) => {
        dispatch(removeTaskAC(id, TodolistId))
    }, [dispatch])

    const addTask = useCallback ((title: string, TodolistId: string) => {
        dispatch(addTaskAC(title, TodolistId))
    }, [dispatch])

    const changeStatus = useCallback ((taskID: string, isDone: boolean, TodoListId: string) => {
        dispatch(changeTaskStatusAC(taskID, isDone, TodoListId))
    }, [dispatch])

    const changeFilter = useCallback ((value: FilterValuesType, todoListId: string) => {
        dispatch(ChangeTodolistFilterAC(value, todoListId))
    }, [dispatch])

    const removeTodoList = useCallback ((TodoListId: string) => {
        dispatch(RemoveTodolistAC(TodoListId));
    }, [dispatch])

    const changeTodolistTitle = useCallback ((id: string, newTitle: string) => {
        dispatch(ChangeTodolistTitleAC(id, newTitle))
    }, [dispatch])

    const changeTaskTitle = useCallback ((taskID: string, newTitle: string, TodoListId: string) => {
        dispatch(changeTaskTitleAC(taskID, newTitle, TodoListId))
    }, [dispatch])

    const addTodolist = useCallback((title: string) => {
        const action = AddTodolistAC(title);
        dispatch(action);
    }, [dispatch])

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
                        todolists.map((tl) => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            return <Grid item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist key={tl.id}
                                              id={tl.id}
                                              title={tl.title}
                                              tasks={tasksForTodolist}
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

export default AppWithRedux;
