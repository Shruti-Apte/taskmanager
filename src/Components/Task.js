import React, { useState } from 'react';
import { Col } from 'react-bootstrap';
import { AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import timeDelta from 'time-delta';
import enLocale from 'time-delta/locales/en';
import ruLocale from 'time-delta/locales/ru';

const Task = ({ item, DeleteTask, onUpdate,CompletedTask}) => {

    timeDelta.addLocale(enLocale);
    timeDelta.addLocale([enLocale, ruLocale]);
    const instance = timeDelta.create({locale: 'en',span:4,delimiter:' : '});

    
    var TimeLeft;
    const calculateTimeleft =()=>{
        const date1 = new Date(item.deadline);
        const date2 = new Date(new Date().toISOString().slice(0,-5));
        TimeLeft=instance.format(date2,date1);
    }

   calculateTimeleft();
    return (
        <Col className='TaskCol'>
            <div>
                <p className='TaskTitle'>{item.label}</p>
                <p>{item.comment === '' ? null : item.comment}</p>
               {item.status==='Active'? <p><span style={{color:'red'}}> {TimeLeft}</span> left.</p>: <span style={{color:'green',fontWeight:'bold'}}>Task Completed</span>}
            </div>
            <div className='IconButtons'>
                <AiTwotoneEdit size={30} color='grey' style={{margin:'5px',cursor:'pointer'}} onClick={() => onUpdate(item.id)} />
                <AiFillDelete size={30} color='grey' style={{margin:'5px',cursor:'pointer'}} onClick={() => DeleteTask(item.id)} />
                {item.status==='Active'?<MdDone size={30} color='grey' style={{margin:'5px',cursor:'pointer'}} onClick={()=>CompletedTask(item.id)}/>:null}
            </div>
        </Col>
    )
}

export default Task;