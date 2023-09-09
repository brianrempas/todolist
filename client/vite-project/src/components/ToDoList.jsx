import React, { useState } from 'react';

export default function ToDoList({ smth, toggleToDo, toggleDelete, toggleUpdate }) {
  const [inputValues, setInputValues] = useState(smth.map((item) => item.id));
  const [inputValuesDate, setInputValuesDate] = useState(smth.map((item) => item.id));

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
  
  const handleInputChange = (e, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };

  const handleInputChangeDate = (e, index) => {
    const newInputValuesDate = [...inputValuesDate];
    newInputValuesDate[index] = e.target.value;
    setInputValuesDate(newInputValuesDate);
  };

  return (
    <ul>
      {smth.map((item, index) => (
        <div key={index} className='beta' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <input
              className='checkbox'
              type='checkbox'
              checked={item.complete}
              onChange={() => toggleToDo(item.id)}
            />
            <input
              className='eidt'
              value={inputValues[index] || item.todo}
              onChange={(e) => handleInputChange(e, index)}
              type='text'
            />
            <i> || </i>
            <input className='eidt as' 
            type='date' 
            value={inputValuesDate[index] || item.deadline}
            onChange={(e) => handleInputChangeDate(e, index)} 
            />
          </div>
          <button 
          className='remover' 
          onClick={() => toggleUpdate(item.id, tester(inputValues[index], item.todo), testerDate(inputValuesDate[index], item.deadline), item.complete)}>
            Update
          </button>
          <button className='remover' onClick={() => toggleDelete(item.id)}>x</button>
        </div>
      ))}
    </ul>
  );
}
