import React, { useState } from 'react';
import { Container, Row, Form, Button, Col } from 'react-bootstrap';
import Task from './Task';
import {db} from '../firebase';
import { getDocs, addDoc, deleteDoc, updateDoc, collection, doc } from "firebase/firestore";


const TaskManager = ({handleLogout,User}) => {
    
    //other variables
    const collectionRef = collection(db, 'Tasks');
    

    //States
    const [ShowTaskType, setShowTaskType] = useState('All');
    const [label, setlabel] = useState('');
    const [status, setstatus] = useState('');
    const [comment, setcomment] = useState('');
    const [deadline, setdeadline] = useState('');
    const [date,setdate]= useState(); //new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()
    const [time,settime]= useState();//new Date().getHours() + ":" + new Date().getMinutes()
    const [attachedfile, setattchedfile] = useState('');
    const [EditId,setEditId]=useState('');
    const [AllTasks, setAllTasks] = useState([]);
    const [Tasks, setTasks] = useState([]);
    const [ActiveTasks, setActiveTasks] = useState([]);
    const [CompleteTasks, setCompleteTasks] = useState([]);

    //onload
    React.useEffect(() => {
        
        const getTasks = async () => {
            const data = await getDocs(collectionRef);
            setTasks(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))); 
        }
        getTasks();
        //sortTasks();
    },[]);

    React.useEffect(() => {
        sortTasks();
    },[Tasks]);

    //Functions
    const AddTask = async (event) => {
        event.preventDefault();
        await addDoc(collectionRef, { UserId:User.uid, label: label, status:'Active', comment: comment, date:date,time:time, deadline:deadline, attachedfile: attachedfile });
        setlabel('');
        setcomment('');
        setattchedfile('');
        setdate('');
        settime('');
    }

    const onUpdate = async (id) => {
        Tasks.map(Task =>{
            if(Task.id===id){
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
    console.log(label,comment,deadline,date,time);
    const UpdateTask = async () => {
        
         const Update = doc(db, 'Tasks', EditId);
         const updatedtask = { label: label, status: 'Active', comment: comment, attachedfile: attachedfile, date:date,time:time,deadline:deadline }
         console.log(updatedtask);
         await updateDoc(Update, updatedtask);
    }

    const CompletedTask = async (id) => { 
        const Update = doc(db, 'Tasks', id);
        const updatedtask = {status:'Completed'}
        await updateDoc(Update, updatedtask);
   }

    const DeleteTask = async (id) => {
        const Deletetask = doc(db, 'Tasks', id);
        await deleteDoc(Deletetask);
    }

    const sortTasks =()=>{
            if(Tasks){
                const temp=Tasks.filter(Task=>Task.UserId===User.uid);
                setAllTasks(temp);
                setActiveTasks( temp.filter(Task=>Task.status==='Active'));
                setCompleteTasks(temp.filter(Task=>Task.status=='Completed'));
            }
        
    }

    
   
    
    const deadlineTask =()=>{
        setdeadline(date+'T'+time+':00');    
    }

    return (
        <Container fluid className="Container">
            <Row className='InputRow'>
                <div style={{display:"flex",justifyContent:'space-evenly',alignItems:'center'}}>
                <p className='title'>Todos</p>
                <Button className='AddButton' style={{width:'10%',height:'50%'}} onClick={()=>handleLogout()}>Logout</Button>
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
                        <Form.Control type="time" value={time} onChange={val=>settime(val.target.value)}/>
                        <Form.Control type="date"  className='ms-3' value={date} onChange={val=>setdate(val.target.value)}/>
                        <Button onClick={()=>deadlineTask()} style={{backgroundColor:'lightgray',marginLeft:'10px',border:'1px black solid',color:'black',width:'50%'}}>set</Button>
                    </Col>
                    <Form.Label>Attach File</Form.Label>
                    {EditId ? <Button variant='light' type="submit" onClick={UpdateTask} className='AddButton'>Update</Button> 
                            : <Button variant='light' type="submit" onClick={AddTask} className='AddButton'>Add</Button>}
                </Form>
                <div style={{display:'flex',margin:"20px"}}> 
                    <Button onClick={()=>setShowTaskType('All')} className='AddButton'>All</Button>
                    <Button onClick={()=>setShowTaskType('Active')} className='AddButton'>Active</Button>
                    <Button onClick={()=>setShowTaskType('Completed')} className='AddButton'>Completed</Button>
                </div>
            </Row>
            <Row md="3" className='TasksRow m-0 p-0'>
                {AllTasks ?
                (
                    ShowTaskType==='All'?
                    AllTasks.map(item => {
                        return (
                            <Task
                                item={item}
                                DeleteTask={DeleteTask}
                                onUpdate={onUpdate}
                                CompletedTask={CompletedTask}
                            />
                        )
                    })
                    :ShowTaskType==='Active'?
                    ActiveTasks.map(item => {
                        
                        return (
                            <Task
                                item={item}
                                DeleteTask={DeleteTask}
                                onUpdate={onUpdate}
                                CompletedTask={CompletedTask}
                            />
                        )
                    })
                    :CompleteTasks.map(item => {
                        return (
                            <Task
                                item={item}
                                DeleteTask={DeleteTask}
                                onUpdate={onUpdate}
                                CompletedTask={CompletedTask}
                            />
                        )
                    })
                ) 
            :<p>No Tasks </p>
            }
            </Row>
        </Container>
    )
}

export default TaskManager;