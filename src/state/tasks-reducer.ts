import {TaskStateType} from "../App";
import {v1} from "uuid";
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootState} from "./store";


type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todolistId: string
}
type AddTaskActionType = {
    type: 'ADD-TASK'
    task: TaskType
}
type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    taskID: string
    status: TaskStatuses
    todoListId: string
}
type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    taskID: string
    newTitle: string
    todoListId: string
}
type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todoListId: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType | ChangeTaskTitleActionType
    | AddTodolistActionType | RemoveTodolistActionType
    | SetTodolistsActionType | SetTasksActionType;

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
            // const newTask = {
            //     id: v1(), title: action.title, status: TaskStatuses.New,
            //     todoListId: action.todolistId, priority: TaskPriorities.Low, description: "",
            //     startDate: "", deadline: "", order: 0, addedDate: ""
            // };
            const stateCopy = {...state};
            const tasks = stateCopy[action.task.todoListId];
            const newTasks = [...tasks, action.task];
            stateCopy[action.task.todoListId] = newTasks;
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todoListId];
            state[action.todoListId] = todolistTasks
                .map(t => t.id === action.taskID
                    ? {...t, status: action.status}
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
        case "SET-TODOLISTS": {
            const stateCopy = {...state};
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            const stateCopy = {...state};
            stateCopy[action.todoListId] = action.tasks
            return stateCopy;
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: "REMOVE-TASK", taskId, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: "ADD-TASK", task}
}
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todoListId: string): ChangeTaskStatusActionType => {
    return {type: "CHANGE-TASK-STATUS", taskID, status, todoListId}
}
export const changeTaskTitleAC = (taskID: string, newTitle: string, todoListId: string): ChangeTaskTitleActionType => {
    return {type: "CHANGE-TASK-TITLE", taskID, newTitle, todoListId}
}
export const setTasksAC = (tasks: Array<TaskType>, todoListId: string): SetTasksActionType => {
    return {type: "SET-TASKS", tasks, todoListId} as const
}
//type SetTasksActionType = ReturnType<typeof setTasksAC>

export const setTasksTC = (todoListId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todoListId)
            .then(res => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todoListId))
            })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch) => {
    todolistsAPI.createTask(todolistId, taskTitle)
        .then(res => {
            let newTask = res.data.data.item
            dispatch(addTaskAC(newTask))
        })
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootState) => {

    let state = getState();
    let allTasks = state.tasks;
    let tasksForCurrentTodolist = allTasks[todolistId];

    const findTask = tasksForCurrentTodolist.find((t) => {
        return t.id === taskId
    })

    if (findTask) {
        const model: UpdateTaskModelType = {
            title: findTask.title,
            status: status,
            startDate: findTask.startDate,
            priority: findTask.priority,
            description: findTask.description,
            deadline: findTask.deadline
        }

        todolistsAPI.updateTask(todolistId, taskId, model)
            .then(res => {
                let updatedTaskStatus = res.data.data.item.status
                dispatch(changeTaskStatusAC(taskId, updatedTaskStatus, todolistId))
            })
    }
}