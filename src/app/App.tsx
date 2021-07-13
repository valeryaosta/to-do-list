import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography, LinearProgress} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TaskType} from "../api/todolists-api";
import {TodolistsList} from "../features/Todolists/TodolistsList";
import {AppRootState} from './store';
import {useSelector} from 'react-redux';
import {RequestStatusType} from "./app-reduser";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";


export type TaskStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    /*    const todolists = useSelector<AppRootState, Array<TodoListDomainType>>(state => state.todolists);
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
        }, [dispatch])*/

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)

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

            {status === 'loading' && <LinearProgress color="secondary"/>}

            <Container fixed>
                <TodolistsList/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}


export default App;
