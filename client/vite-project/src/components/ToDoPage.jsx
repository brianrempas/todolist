import React, { useEffect  } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setList, setUserData, setInputValue, setInputValueDate, setInputValueSearch } from './redux/counterSlice'
import ToDoList from './ToDoList';
import './App.css'
import { useNavigate } from 'react-router-dom'
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>

function ToDoPage() {
    var attention = document.getElementById('attention');
    const history = useNavigate();
    const List = useSelector((state) => state.counter.List);
    const UserData = useSelector((state) => state.counter.UserData);
    const InputValue = useSelector((state) => state.counter.InputValue);
    const InputValueDate = useSelector((state) => state.counter.InputValueDate);
    const InputValueSearch = useSelector((state) => state.counter.InputValueSearch);
    const dispatch = useDispatch();
    
    useEffect(() => {
      fetchToDoList();
    }, []);

    function setInput(e) {
      dispatch(setInputValue(e.target.value))
    }
    function setInputDate(e) {
      dispatch(setInputValueDate(e.target.value))
    }
    function setInputSearch(e) {
      dispatch(setInputValueSearch(e.target.value))
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
        dispatch(setUserData({id: userData.id, name: userData.name, username: userData.username}))
        title.textContent = 'Hello, ' + userData.name;
        const newTodoList = []; 

        for(var i = 0; i < todoData.length; i++){
          const newTodo = {
            id: todoData[i].id,
            todo: todoData[i].todo,
            deadline: todoData[i].deadline,
            complete: todoData[i].complete,
          };
          //setList([...List, newTodo]);
          newTodoList.push(newTodo)
        }
        dispatch( setList(newTodoList) )
        
      })
      .catch((error) => {
        console.log(error)
      });
    }

    function handleAddList(e) {
      e.preventDefault();
      const name = InputValue;
      const deadline = InputValueDate;
  
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
              dispatch(setList(
                [...List, {
                id: data.todo.id,
                todo: data.todo.todo,
                deadline: data.todo.deadline,
                complete: data.todo.complete
                }]
              ))
              dispatch(setInputValue(''))
              dispatch(setInputValueDate(''))
              attention.textContent = 'Task created successfully'
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            attention.textContent = 'Error'
          });
      }
    }
  
    const handleCheckboxChange = (id) => {
      const Change = List.map((item) => 
            item.id === id ? { ...item, complete: !item.complete } : item )
      dispatch(setList(Change))
    };
    
    function handleRemoveItem() {
      //setList((prevList) => prevList.filter((List) => List.complete !== true));
    };
  
    function handleRemoveAll() {
      //setList([]);
    };

    const handleRemoveX = (id) => {
      const updatedRList = List.filter((List) => List.id !== id)
      dispatch(setList(updatedRList))
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
              console.log('Task deleted successfully', data);
              attention.textContent = 'Task deleted successfully'
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            attention.textContent = 'Error'
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
      
      const updatedList = List.map((item) => {
        if (item.id === id) {
          return { ...item, ...form };
        }
        return item;
      });
      dispatch(setList(updatedList))
    
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
            response.json();
            attention.textContent = 'Task updated successfully'
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

    const handleSearch = () => {
      const key = InputValueSearch;
      if (key === ''){
        fetchToDoList()
      } else {
        fetch(`http://localhost:3000/user/Search/${key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
        const todoDataRenewal = data[0].todoFilteredData;
        console.log(data)
        const newTodoList = [];

        for(var i = 0; i < todoDataRenewal.length; i++){
          const newTodo = {
            id: todoDataRenewal[i].id,
            todo: todoDataRenewal[i].todo,
            deadline: todoDataRenewal[i].deadline,
            complete: todoDataRenewal[i].complete,
          };
          newTodoList.push(newTodo);
        }
        dispatch(setList(newTodoList))
        attention.textContent = todoDataRenewal.length + ' results'
      })
      .catch((error) => {
        console.error('Error:', error);
        attention.textContent = 'Error'
      });
      }
      
    };

    function reset() {
      fetchToDoList()
      dispatch(setInputValueSearch(''))
      attention.textContent = ''
    }
  return (
    <div className='all'>
      <div className='Title'>To Do List </div>
      <div id='title'></div>
      <div id='attention'></div>
      <input className='text' value={InputValue} onChange={setInput} placeholder='To do?' type='text'/>
      <input className='text' value={InputValueDate} onChange={setInputDate} type='date'/>
      <button onClick={handleAddList} style={{marginBottom: '10px'}}>Add List</button>   
      <input value={InputValueSearch} onChange={setInputSearch} type="text" placeholder="Search.." className="text"/>
      <div><button onClick={handleSearch} type="submit"><i className="fa fa-search">Search</i></button> 
      <button onClick={reset} type="submit"><i className="fa fa-search">Reset</i></button></div>
      <br/>
      <ToDoList smth={List} toggleToDo={handleCheckboxChange} toggleDelete={handleRemoveX} toggleUpdate={handleUpdate}/>
      
    </div>
  )
}
//<button onClick={handleRemoveItem}>Remove Completed Lists</button>
//<button onClick={handleRemoveAll}>Remove All Lists</button>
export default ToDoPage;
