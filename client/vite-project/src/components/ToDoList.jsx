import React, { useEffect  } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInputValues, setInputValuesDate, } from './redux/counterSliceList'

export default function ToDoList({ smth, toggleToDo, toggleDelete, toggleUpdate }) {

  let inputValues = ''
  let inputValuesDate = ''

  inputValues = useSelector((state) => state.counterList.inputValues)
  inputValuesDate = useSelector((state) => state.counterList.inputValuesDate)
  const dispatch = useDispatch();

  function tester(edited, ori){
    if (edited === undefined) {
      return ori;
    } else {
      return edited;
    } 
  }

  function testerDate(editedDate, ori){
    if (editedDate === undefined) {
      return ori;
    } else {
      return editedDate;
    }
  }
  
  const checkChange = (id, order) => {
    const divElement = document.getElementById(`updateTodo_${id}`);
    switch(order){
      case 'none':
        return divElement.style.display = "none";
      case 'block':
        return divElement.style.display = "block";
    }
  }

  const handleInputChange = (e, index, id) => {
    const divElement = document.getElementById(`updateTodo_${id}`);
    divElement.style.display = "block";
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    dispatch(setInputValues(newInputValues))
  };

  const handleInputChangeDate = (e, index, id) => {
    const divElement = document.getElementById(`updateTodo_${id}`);
    divElement.style.display = "block";
    const newInputValuesDate = [...inputValuesDate];
    newInputValuesDate[index] = e.target.value;
    dispatch(setInputValuesDate(newInputValuesDate))
  };


  return (
    <ul>
      <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
      </div>
      {smth.map((item) => (
        <div key={item.id} className='beta' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <input
              className='checkbox'
              type='checkbox'
              checked={item.complete}
              onChange={() => {
                toggleToDo(item.id)
                checkChange(item.id, 'block')
              }}
            />
            <input
              className='eidt'
              value={inputValues[item.id] === undefined ? item.todo : inputValues[item.id]}
              onChange={(e) => handleInputChange(e, item.id, item.id)}
              type='text'
            />
            <i> || </i>
            <input className='eidt as' 
            type='date' 
            value={inputValuesDate[item.id] || item.deadline}
            onChange={(e) => handleInputChangeDate(e, item.id, item.id)} 
            />
          </div>
          <button 
          className='remover' id={`updateTodo_${item.id}`} style={{display: 'none'}}
          onClick={() => {
            toggleUpdate(item.id, tester(inputValues[item.id], item.todo), testerDate(inputValuesDate[item.id], item.deadline), item.complete); 
            checkChange(item.id, 'none')}}> Update
          </button>
          <button className='remover' onClick={() => toggleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </ul>
  );
}
