import React, { useState, useRef, useEffect  } from 'react';
import ToDoList from './ToDoList';
import './App.css'
import { useNavigate } from 'react-router-dom'

function ToDoPage() {

    const history = useNavigate();

    const [List, setList] = useState([])
    const [UserData, setUserData] = useState({id: 0, name: '', password: '', username: ''})
    const [InputValue, setInputValue] = useState('')
    const [InputValueDate, c] = useState('')
    const todoNameRef = useRef();
    const todoDateRef = useRef();

    useEffect(() => {
      fetchToDoList();
    }, []);

    function setInput(e) {
      return setInputValue(e.target.value)
    }
    function setInputDate(e) {
      c(e.target.value);
    }

    
    const token = localStorage.getItem('Token');
    const rtoken = localStorage.getItem('rToken');

    function fetchToDoList() {
    
      if (!token || !rtoken) {
        console.log('token and rtoken is null');
        history(`/login`);
        return;
      }

      fetch('http://localhost:3000/user/ToDoPage', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else if (response.status === 403) {
          console.log('Log In Expired!');
          history(`/login`);
        } else {
          throw new Error('Failed to fetch data');
        }
      })
      .then((data) => {
        const todoData = data[0].todoData;
        const userData = data[1].userData[0];
        setUserData({id: userData.id, name: userData.name, password: userData.password, username: userData.username})
        console.log(data)
        title.textContent = 'Hello, ' + userData.name;

        for(var i = 0; i < todoData.length; i++){
          const newTodo = {
            id: todoData[i].id,
            todo: todoData[i].todo,
            deadline: todoData[i].deadline,
            complete: todoData[i].complete,
          };
          //setList([...List, newTodo]);
          List.push(newTodo)
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }

    function handleAddList(e) {
      e.preventDefault();
      const name = todoNameRef.current.value;
      const deadline = todoDateRef.current.value;
  
      if (name === '' || deadline === '') {} 
      
      else {
        const newTodo = {
          username: UserData.username,
          todo: name,
          deadline: deadline,
          complete: false,
          userid: UserData.id
        };
  
        fetch('http://localhost:3000/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTodo),
        })
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            } else if (response.status === 403) {
              console.error('Log In Expired');
              history(`/login`);
            } else {
              console.error('Failed to create task');
              throw new Error('Failed to create task');
            }
          })
          .then((data) => {
            if(data === undefined){
            } else {
              console.log('Task created successfully', data);
              setList([...List, data.todo]);
              setInputValue('');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  
    const handleCheckboxChange = (id) => {
      setList((prevList) =>
        prevList.map((item) =>
          item.id === id ? { ...item, complete: !item.complete } : item
        )
      );
    };
    
    function handleRemoveItem() {
      setList((prevList) => prevList.filter((List) => List.complete !== true));
    };
  
    function handleRemoveAll() {
      setList([]);
    };

    const handleRemoveX = (id) => {
      setList((prevList) => prevList.filter((List) => List.id !== id));
      fetch(`http://localhost:3000/api/todos/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            } else if (response.status === 403) {
              console.error('Log In Expired');
              history(`/login`);
            } else {
              console.error('Failed to create task');
              throw new Error('Failed to create task');
            }
          })
          .then((data) => {
            if(data === undefined){
            } else {
              console.log('Task created successfully', data);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
    
    const handleUpdate = (id, name, deadline, complete) => {
      const form = {
        todo: name,
        deadline: deadline,
        complete: complete,
      };
      console.log(form)
      console.log(form.todo)
      setList((prevList) => {
        return prevList.map((item) => {
          if (item.id === id) {
            return { ...item, ...form };
          }
          return item;
        });
      });
    
      fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else if (response.status === 403) {
            console.error('Log In Expired');
            history(`/login`);
          } else {
            console.error('Failed to create task');
            throw new Error('Failed to create task');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

  return (
    <div className='all'>
      <div className='Title'>To Do List </div>
      <div id='title'></div>
      <input className='text' ref={todoNameRef} value={InputValue} onChange={setInput} placeholder='To do?' type='text'/>
      <input className='text' ref={todoDateRef} value={InputValueDate} onChange={setInputDate} type='date'/>
      <button onClick={handleAddList}>Add List</button>
      
      <br/>
      <ToDoList smth={List} toggleToDo={handleCheckboxChange} toggleDelete={handleRemoveX} toggleUpdate={handleUpdate}/>
      
    </div>
  )
}
//<button onClick={handleRemoveItem}>Remove Completed Lists</button>
//<button onClick={handleRemoveAll}>Remove All Lists</button>
export default ToDoPage;
