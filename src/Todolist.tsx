import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, TodolistId: string) => void
    changeFilter: (value: FilterValuesType, TodolistId: string) => void
    addTask: (title: string, TodoListId: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, TodoListId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, TodoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (TodoListId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export function Todolist(props: PropsType) {

    const onAllClickHandler = () => props.changeFilter("all", props.id)
    const onActiveClickHandler = () => props.changeFilter("active", props.id)
    const onCompletedHandler = () => props.changeFilter("completed", props.id)
    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }
    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodolistTitle(props.id, newTitle)
    }
    return <div>
        <h3><EditableSpan title={props.title} onChange={changeTodoListTitle}/>
            <IconButton onClick={removeTodoList}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks.map(t => {
                    const onRemoveHandler = () => {
                        props.removeTask(t.id, props.id)
                    }
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
                    }
                    const onChangeTitleHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id)
                    }
                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            onChange={onChangeHandler}
                            checked={t.isDone}/>
                        <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                        <IconButton onClick={onRemoveHandler}>
                            <Delete/>
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button onClick={onAllClickHandler} variant={props.filter === "all" ? "contained" : "text"}>
                All
            </Button>
            <Button color={"primary"} onClick={onActiveClickHandler}
                    variant={props.filter === "active" ? "contained" : "text"}>
                Active
            </Button>
            <Button color="secondary" onClick={onCompletedHandler}
                    variant={props.filter === "completed" ? "contained" : "text"}>
                Completed
            </Button>
        </div>
    </div>
}

