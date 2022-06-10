import {useEffect, useState} from "react";
import {Todo} from "../model";

interface EditItemProps {
    fetchAll: () => void;
    editMode: string;
    setEditMode: (input: string) => void;
    editId: string;
}

export default function EditItem (props: EditItemProps) {

    const [task, setTask] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("");

    useEffect(()=>{
        if(props.editMode === "edit"){
            getTaskById();
        }
    }, [props])

    const getTaskById = () => {
        console.log(`fetch todo by id`);
        fetch(`http://localhost:8080/api/kanban/${props.editId}`)
            .then(response => response.json())
            .then((todo: Todo) => {
                setTask(todo.task);
                setDescription(todo.description);
                setStatus(todo.status);
                console.log(todo);
            });
    }

    const addNewTodo = () => {
        console.log(`saving: ${task} ${description}`)

        fetch('http://localhost:8080/api/kanban', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task: task, description: description, status: "OPEN"}),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                props.fetchAll();
                props.setEditMode("view");
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function editTodo() {
        console.log(`edit: ${task} ${description}`)

        fetch('http://localhost:8080/api/kanban', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task: task, description: description, status: status, id: props.editId}),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                props.fetchAll();
                props.setEditMode("view");// TODO bessere Möglichkeit
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div>
            <label htmlFor="task">Task: </label>
            <input id="task" type="text" value={task}
                   onChange={ev => {
                       setTask(ev.target.value)
                       console.log(`set task to ${ev.target.value}`)
                   }}/>
            <br/>
            <label htmlFor="desc">Description: </label>
            <input id="desc" type="text" value={description}
                   onChange={ev => {
                       setDescription(ev.target.value)
                       console.log(`set description to ${ev.target.value}`)
                   }}/>
            <br/>
            {
                props.editMode === "new" &&
                    <button onClick={() => addNewTodo()}>save</button>
            }
            {
                props.editMode === "edit" &&
                    <button onClick={() => editTodo()}>edit</button>
            }

        </div>
    )
}