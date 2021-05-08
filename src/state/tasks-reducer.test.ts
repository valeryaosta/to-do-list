import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer,} from './tasks-reducer';

import {AddTodolistAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";
import {TaskStateType} from '../App';

let startState: TaskStateType = {};
beforeEach(() => {
    startState = {
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
    }
})


test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(2);
    expect(endState["todolistId2"].length).toBe(1);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC("Sweets", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(2);
    expect(endState["todolistId2"].length).toBe(3);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("Sweets");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC("2", "MilkyWay", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("MilkyWay");
    expect(endState["todolistId1"][1].title).toBe("React-Redux");
});

test('new property with new array should be added when new todolist is added', () => {

    const action = AddTodolistAC("new todolist");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

