import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType, TodoListId1, TodoListId2} from "./todolists-reducer";


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


const initialState:TaskStateType  = {
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
}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state};
            const tasks = state[action.todolistId];
            const filteredTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todolistId];
            const newTask = {id: v1(), title: action.title, isDone: false};
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            const stateCopy = {...state};
            let tasks = stateCopy[action.todoListId];
            let task = tasks.find(t => t.id === action.taskID)
            if (task) {
                task.isDone = action.isDone;
            }
            return stateCopy;
        }
        case "CHANGE-TASK-TITLE": {
            const stateCopy = {...state};
            let tasks = stateCopy[action.todoListId];
            let task = tasks.find(t => t.id === action.taskID)
            if (task) {
                task.title = action.newTitle;
            }
            return stateCopy;
        }
        case "ADD-TODOLIST": {
            const stateCopy = {...state};
            stateCopy[action.todolistId] = [];
            return stateCopy;
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

