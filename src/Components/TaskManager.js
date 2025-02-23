import React, { useState } from 'react';
import { Container, Row, Form, Button, Col } from 'react-bootstrap';
import Task from './Task';
import { db } from '../firebase';
import { getDocs, addDoc, deleteDoc, updateDoc, collection, doc } from "firebase/firestore";


const TaskManager = ({ handleLogout, User }) => {

    //other variables
    const collectionRef = collection(db, 'Tasks');


    //States
    const [ShowTaskType, setShowTaskType] = useState('All');
    const [label, setlabel] = useState('');
    const [status, setstatus] = useState('');
    const [comment, setcomment] = useState('');
    const [deadline, setdeadline] = useState('');
    const [date, setdate] = useState(); //new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
    const [time, settime] = useState();//new Date().getHours() + ":" + new Date().getMinutes()
    const [attachedfile, setattchedfile] = useState('');
    const [EditId, setEditId] = useState('');
    const [Tasks, setTasks] = useState([]);
    

    //onload
    React.useEffect(() => {
        getTasks();

    }, []);

  
    //Functions
    const getTasks = async () => {
        const data = await getDocs(collectionRef);
        const temp = data.docs.filter(task=>task.data().UserId===User.uid);
        setTasks(temp.map(doc => ({ ...doc.data(), id: doc.id })));
    }

    const AddTask = async (event) => {
        event.preventDefault();
        await addDoc(collectionRef, { UserId: User.uid, label: label, status: 'Active', comment: comment, date: date, time: time, deadline: deadline, attachedfile: attachedfile });
        setlabel('');
        setcomment('');
        setattchedfile('');
        setdate('');
        settime('');
        getTasks();
    }

    const onUpdate = async (id) => {
        Tasks.map(Task => {
            if (Task.id === id) {
                setEditId(id);
                setlabel(Task.label);
                setcomment(Task.comment);
                setattchedfile(Task.attachedfile);
                setdate(Task.date);
                settime(Task.time);
                setdeadline(Task.deadline);
            }
        });
    }

    const UpdateTask = async () => {
        console.log("lol", EditId);
        // const docRef = doc(db, 'Tasks', EditId);
        // const docSnap = await getDoc(docRef);
        // if (!docSnap.exists()) {
        //     console.error("Document does not exist!");
        //     return;
        // }
        
        // await updateDoc(docRef, updatedtask);
        
        // const Update = doc(db, 'Tasks', EditId);
        // const updatedtask = { label: label, status: 'Active', comment: comment, attachedfile: attachedfile, date: date, time: time, deadline: deadline }
        // await updateDoc(Update, updatedtask);
    }

    const CompletedTask = async (id) => {
        const Update = doc(db, 'Tasks', id);
        const updatedtask = { status: 'Completed' }
        await updateDoc(Update, updatedtask);
        alert('Task added to Completed list!');
        getTasks();
    }

    const DeleteTask = async (id) => {
        const Deletetask = doc(db, 'Tasks', id);
        await deleteDoc(Deletetask);
        alert('Task Deleted Successfully!');
        getTasks();
    }

    const deadlineTask = () => {
        setdeadline(date + 'T' + time + ':00');
    }


    return (
        <Container fluid className="Container">
            <Row className='InputRow'>
                <div style={{ display: "flex", justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <p className='title'>Todos</p>
                    <Button className='AddButton' style={{ width: '10%', height: '50%' }} onClick={() => handleLogout()}>Logout</Button>
                </div>
                <Form className='Inputform'>
                    <Form.Label>Add Task<span style={{ color: 'red', fontWeight: 'bold' }}> * </span></Form.Label>
                    <Form.Control placeholder="What needs to be done" value={label} onChange={(val) => setlabel(val.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                        Please choose a username.
                    </Form.Control.Feedback>
                    <Form.Label>Add Comment</Form.Label>
                    <Form.Control placeholder="Add comment" value={comment} onChange={(val) => setcomment(val.target.value)} />
                    <Form.Label>Add Deadline</Form.Label>
                    <Col md="10" style={{ display: 'flex', padding: '2px' }}>
                        <Form.Control type="time" value={time} onChange={val => settime(val.target.value)} />
                        <Form.Control type="date" className='ms-3' value={date} onChange={val => setdate(val.target.value)} />
                        <Button onClick={() => deadlineTask()} style={{ backgroundColor: 'lightgray', marginLeft: '10px', border: '1px black solid', color: 'black', width: '50%' }}>set</Button>
                    </Col>

                    {EditId ? <Button variant='light' type="submit" onClick={UpdateTask} className='AddButton'>Update</Button>
                        : <Button variant='light' type="submit" onClick={AddTask} className='AddButton'>Add</Button>}
                </Form>
                <div style={{ display: 'flex', margin: "20px" }}>
                    <Button onClick={() => setShowTaskType('All')} className='AddButton'>All</Button>
                    <Button onClick={() => setShowTaskType('Active')} className='AddButton'>Active</Button>
                    <Button onClick={() => setShowTaskType('Completed')} className='AddButton'>Completed</Button>
                </div>
            </Row>
            <Row md="3" className='TasksRow m-0 p-0'>
                {Tasks ?
                    (
                        ShowTaskType === 'Completed' ?
                            (Tasks.map(item => {
                                if (item.status === "Completed") {
                                    return <Task
                                        item={item}
                                        DeleteTask={DeleteTask}
                                        onUpdate={onUpdate}
                                        CompletedTask={CompletedTask}
                                    />
                                }
                                })
                            ) 
                        :ShowTaskType === 'Active' ?
                            (Tasks.map(item => {
                                if (item.status === "Active") {
                                    return <Task
                                            item={item}
                                            DeleteTask={DeleteTask}
                                            onUpdate={onUpdate}
                                            CompletedTask={CompletedTask}
                                        />
                                    }
                                })
                            ) 
                        :(
                            Tasks.map(item => {

                                        return <Task
                                            item={item}
                                            DeleteTask={DeleteTask}
                                            onUpdate={onUpdate}
                                            CompletedTask={CompletedTask}
                                        />
                                    
                                })
                         )
                    ) : <p>No Tasks </p>

                }
            </Row>
        </Container>
    )
}

export default TaskManager;