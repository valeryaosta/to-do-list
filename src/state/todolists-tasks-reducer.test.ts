
import {AddTodolistAC, RemoveTodolistAC, TodoListDomainType, todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";
import {TaskPriorities, TaskStatuses, TodoListType} from "../api/todolists-api";
import { TaskStateType } from "../App";

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodoListDomainType> = [];

    const action = AddTodolistAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});

test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {
                id: "1", title: "Javascript", status: TaskStatuses.Completed,
                todoListId: "TodoListId1", startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            },
            {
                id: "2", title: "React-Redux", status: TaskStatuses.Completed,
                todoListId: "TodoListId1", startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "Bread", status: TaskStatuses.Completed,
                todoListId: "TodoListId2", startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            },
            {
                id: "2", title: "Milk", status: TaskStatuses.Completed,
                todoListId: "TodoListId2", startDate: "", deadline: "", addedDate: "",
                order: 0, priority: TaskPriorities.Low, description: ""
            }
        ]
    };

    const action = RemoveTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).toBeUndefined();
});

