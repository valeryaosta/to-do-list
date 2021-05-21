import React, {useCallback, useEffect} from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistTC,
    ChangeTodolistFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    setTodolistsTC,
    TodoListDomainType,
} from "../features/Todolists/todolists-reducer";
import {addTaskTC, removeTaskTC, updateTaskStatusTC,} from "../features/Todolists/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./store";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/Todolists/TodolistsList";


export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todolists = useSelector<AppRootState, Array<TodoListDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootState, TaskStateType>(state => state.tasks);

    const dispatch = useDispatch();

    useEffect(() => {
        const thunk = setTodolistsTC()
        dispatch(thunk)
    }, [])

    const removeTask = useCallback((id: string, TodolistId: string) => {
        const thunk = removeTaskTC(id, TodolistId)
        dispatch(thunk)
    }, [])

    const addTask = useCallback((title: string, TodolistId: string) => {
        const thunk = addTaskTC(TodolistId, title)
        dispatch(thunk)
    }, [])

    const changeStatus = useCallback((taskID: string, status: TaskStatuses, TodoListId: string) => {
        const thunk = updateTaskStatusTC(TodoListId, taskID, {status})
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todoListId: string) => {
        const action = ChangeTodolistFilterAC(value, todoListId)
        dispatch(action)
    }, [])

    const removeTodoList = useCallback((TodoListId: string) => {
        const thunk = removeTodolistTC(TodoListId)
        dispatch(thunk);
    }, [])

    const changeTodolistTitle = useCallback((id: string, newTitle: string) => {
        const thunk = changeTodolistTitleTC(id, newTitle)
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback((taskID: string, newTitle: string, TodoListId: string) => {
        const thunk = updateTaskStatusTC(TodoListId, taskID, {title: newTitle})
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback((title: string) => {
        const thunk = addTodolistTC(title);
        dispatch(thunk);
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
                {/*                <Grid container style={{padding: "10px"}}>
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
                </Grid>*/}
                <TodolistsList/>
            </Container>

        </div>
    );
}


export default App;
