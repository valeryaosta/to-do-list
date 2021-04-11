import React, {ChangeEvent, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import { Task } from './Task';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todoListId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskID: string, newTitle: string, todoListId: string) => void
    filter: FilterValuesType
    removeTodoList: (todoListId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist = React.memo((props: PropsType) => {
    console.log("Todolist is called")
    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.changeFilter, props.id]);
    const onCompletedHandler = useCallback(() => props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id]);
    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(props.id, newTitle)
    }, [props.changeTodolistTitle, props.id]);

    let tasksForTodolist = props.tasks;

    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.isDone === false);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.isDone === true);
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
                props.tasks.map(t => <Task
                        key={t.id}
                        task={t}
                        changeTaskStatus={props.changeTaskStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        removeTask={props.removeTask}
                        todolistId={props.id}
                    />
                )
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
})

