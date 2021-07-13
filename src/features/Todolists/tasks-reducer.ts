import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootState} from "../../app/store";
import {setAppStatusAC, setAppStatusActionType} from "../../app/app-reduser";

type TaskStateType = {
    [key: string]: Array<TaskType>
}

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]:
                    state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todolist.id]: []
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
        case "SET-TASKS":
            return {
                ...state,
                [action.todoListId]: action.tasks
            }
        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: "REMOVE-TASK", taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todoListId: string) =>
    ({type: "UPDATE-TASK", model, taskId, todoListId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todoListId: string) =>
    ({type: "SET-TASKS", tasks, todoListId} as const)

//thunks
export const setTasksTC = (todoListId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTasks(todoListId)
            .then(res => {
                dispatch(setAppStatusAC("succeeded"))
                const tasks = res.data.items
                const action = setTasksAC(tasks, todoListId)
                dispatch(action)
            })
    }
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(setAppStatusAC("succeeded"))
            const action = removeTaskAC(taskId, todolistId)
            dispatch(action)
        })
}
export const addTaskTC = (todolistId: string, taskTitle: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    todolistsAPI.createTask(todolistId, taskTitle)
        .then((res) => {
            dispatch(setAppStatusAC("succeeded"))
            let newTask = res.data.data.item
            const action = addTaskAC(newTask)
            dispatch(action)
        })
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType,) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootState) => {
        dispatch(setAppStatusAC("loading"))

        const state = getState();
        const allTasks = state.tasks;
        const tasksForCurrentTodolist = allTasks[todolistId];

        const findTask = tasksForCurrentTodolist.find((t) => {
            return t.id === taskId
        })

        if (findTask) {
            const model: UpdateTaskModelType = {
                title: findTask.title,
                status: findTask.status,
                startDate: findTask.startDate,
                priority: findTask.priority,
                description: findTask.description,
                deadline: findTask.deadline,
                ...domainModel
            }

            todolistsAPI.updateTask(todolistId, taskId, model)
                .then((res) => {
                    dispatch(setAppStatusAC("succeeded"))
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                })
        }
    }

//types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | setAppStatusActionType
