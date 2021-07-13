import {todolistsAPI, TodoListType} from "../../api/todolists-api";
import {Dispatch} from "redux";
import {setAppStatusAC, setAppStatusActionType} from "../../app/app-reduser";

const initialState: Array<TodoListDomainType> = [];

export const todolistsReducer = (state: Array<TodoListDomainType> = initialState, action: ActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: "all"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return state
    }
}

//actions
export const RemoveTodolistAC = (id: string) => ({type: "REMOVE-TODOLIST", id} as const)
export const AddTodolistAC = (todolist: TodoListType) => ({type: "ADD-TODOLIST", todolist} as const)
export const ChangeTodolistTitleAC = (id: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title
} as const)
export const ChangeTodolistFilterAC = (filter: FilterValuesType, id: string) =>
    ({type: "CHANGE-TODOLIST-FILTER", filter, id} as const)
export const SetTodolistAC = (todolists: Array<TodoListType>) => ({type: "SET-TODOLISTS", todolists} as const)

//thunks
export const setTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTodolists()
            .then(res => {
                dispatch(setAppStatusAC("succeeded"))
                dispatch(SetTodolistAC(res.data))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.deleteTodoTitle(todolistId)
            .then((res) => {
                dispatch(setAppStatusAC("succeeded"))
                dispatch(RemoveTodolistAC(todolistId))
            })
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.createTodolists(title)
            .then((res) => {
                dispatch(setAppStatusAC("succeeded"))
                dispatch(AddTodolistAC(res.data.data.item))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.updateTodoTitle(id, title)
            .then((res) => {
                dispatch(setAppStatusAC("succeeded"))
                dispatch(ChangeTodolistTitleAC(id, title))
            })
    }
}

//types
export type AddTodolistActionType = ReturnType<typeof AddTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof SetTodolistAC>;
type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof ChangeTodolistTitleAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | SetTodolistsActionType
    | setAppStatusActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}
