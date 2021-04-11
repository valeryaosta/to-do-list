import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField, IconButton} from "@material-ui/core";
import ControlPoint from '@material-ui/icons/ControlPoint';

type AddItemPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo ((props: AddItemPropsType) => {
    console.log('Add Item Form is called')
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error!==null) {
            setError(null)
        }
        if (e.charCode === 13) {
            props.addItem(newTaskTitle)
            setNewTaskTitle("")
        }
    }
    const addTask = () => {
        if (newTaskTitle.trim() !== "") {
            props.addItem(newTaskTitle.trim());
            setNewTaskTitle("");
        } else {
            setError("Title is required");
        }
    }
    return <div>
        <TextField value={newTaskTitle}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
                   variant={"outlined"}
                   label={"Type value"}
                   helperText={error}
        />
        <IconButton onClick={addTask} color={"primary"}>
            <ControlPoint/>
        </IconButton>
    </div>
})
