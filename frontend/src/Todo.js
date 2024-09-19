import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editid, setEditId] = useState(-1);

    //edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000"

    // To submit a item
    const handleSubmit = () => {
        setError("")
        //Check input
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    //add item in list
                    setTodos([...todos, { title, description }])
                    setTitle("")
                    setDescription("")
                    setMessage("Item added Successfully")
                    setTimeout(() => {
                        setMessage("");
                    }, 3000)
                } else {
                    //set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })
        }
    }

    // To Edit a item
    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    // To update a item
    const handleUpdate = () => {
        setError("")
        //Check input
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editid, {
                method: "PUT",
                headers: {
                    'content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    //update item in list
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editid) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })

                    setTodos(updatedTodos)
                    setEditTitle("")
                    setEditDescription("")
                    setMessage("Item Updated Successfully")
                    setTimeout(() => {
                        setMessage("");
                    }, 3000)

                    setEditId(-1)

                } else {
                    //set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    //get item
    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                setTodos(res)
            })
    }

    // To cancel a item
    const handleEditCancel = () => {
        setEditId(-1)
    }

    // To delete a item
    const handleDelete = (id) => {
        if (window.confirm('Are you sure want to Delete')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                })
        }
    }

    return <>
        {/* Heading */}
        <div className="row p-3 bg-success text-light">
            <h1>Todo project with Mern stack</h1>
        </div>

        {/* To add an item */}
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" />
                <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" type="text" />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p>{error}</p>}
        </div>

        {/* To Display an item */}
        <div className="row mt-3">
            <h3>Task</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    {
                        todos.map((item) => <li className="list-group-item bg-info d-flex justify-content-between align-item-center my-2">
                            <div className="d-flex flex-column me-2">
                                {
                                    editid === -1 || editid !== item._id ? <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span >{item.description}</span>
                                    </> : <>
                                        <div className="form-group d-flex gap-2">
                                            <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text" />
                                            <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" type="text" />
                                        </div>
                                    </>
                                }

                            </div>
                            <div className="d-flex gap-2">
                                {editid === -1 || editid !== item._id ? <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={(handleUpdate)}>Update</button>}
                                {editid === -1 || editid !== item._id ? <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button> :
                                    <button className="btn btn-danger" onClick={handleEditCancel}>Cencel</button>}
                            </div>
                        </li>
                        )
                    }

                </ul>
            </div>
        </div>
    </>
}