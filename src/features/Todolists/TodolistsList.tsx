import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";


import {Grid, Paper} from "@material-ui/core";
import { AppRootState } from "../../app/store";
import {
    TodoListDomainType,
    setTodolistsTC,
    FilterValuesType,
    ChangeTodolistFilterAC,
    removeTodolistTC,
    changeTodolistTitleTC,
    addTodolistTC
} from "./todolists-reducer";
import {TaskStateType} from "../../app/App";
import {addTaskTC, removeTaskTC, updateTaskStatusTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";


export const TodolistsList: React.FC = () => {

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

    return <>
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
    </>
}