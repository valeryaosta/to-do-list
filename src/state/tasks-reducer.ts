import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";


type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string
}
type AddTaskActionType = {
    type: 'ADD-TASK'
    title: string
    todolistId: string
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskID: string
    isDone: boolean
    todoListId: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskID: string
    newTitle: string
    todoListId: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType | ChangeTaskTitleActionType
    | AddTodolistActionType | RemoveTodolistActionType;

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]:
                    state[action.todolistId].filter(t => t.id !== action.taskId)
            }
            // const stateCopy = {...state};
            // const tasks = state[action.todolistId];
            // const filteredTasks = tasks.filter(t => t.id !== action.taskId);
            // stateCopy[action.todolistId] = filteredTasks;
            // return stateCopy;
        }
        case 'ADD-TASK': {
            const newTask = {id: v1(), title: action.title, isDone: false};
            return {
                ...state,
                [action.todolistId]: [newTask, ...state[action.todolistId]]
            }
            // const stateCopy = {...state};
            // const tasks = stateCopy[action.todolistId];
            // const newTask = {id: v1(), title: action.title, isDone: false};
            // const newTasks = [newTask, ...tasks];
            // stateCopy[action.todolistId] = newTasks
            // return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todoListId];
            state[action.todoListId] = todolistTasks
                .map(t => t.id === action.taskID
                    ? {...t, isDone: action.isDone}
                    : t);
            return ({...state});
        }
        case "CHANGE-TASK-TITLE": {
            let todolistTasks = state[action.todoListId];
            state[action.todoListId] = todolistTasks
                .map(t => t.id === action.taskID
                    ? {...t, title: action.newTitle}
                    : t);
            return ({...state});
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id];
            return stateCopy;
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: "REMOVE-TASK", taskId, todolistId}
}
export const addTaskAC = (title: string, todolistId: string): AddTaskActionType => {
    return {type: "ADD-TASK", title, todolistId}
}
export const changeTaskStatusAC = (taskID: string, isDone: boolean, todoListId: string): ChangeTaskStatusActionType => {
    return {type: "CHANGE-TASK-STATUS", taskID, isDone, todoListId}
}
export const changeTaskTitleAC = (taskID: string, newTitle: string, todoListId: string): ChangeTaskTitleActionType => {
    return {type: "CHANGE-TASK-TITLE", taskID, newTitle, todoListId}
}

