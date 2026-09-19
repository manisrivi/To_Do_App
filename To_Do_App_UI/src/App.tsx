import './App.css'
import { useEffect, useState } from 'react';
import type { ToDoListItem } from './to_do_type';
import { createToDo, deleteToDo, readToDo } from './API';


function App() {
  const [value, setValue] = useState('');

  const [list, setList] = useState<ToDoListItem[] | null>(null);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const getList = async () => {
    const response = await readToDo();
    setList(response);
  }


  const createHandler = async () => {
    if (!value.trim()) return;
    try {
      const response = await createToDo(value);
      if (response) {
        getList();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteItem = async (id: string) => {
    try {
      await deleteToDo(id);
      getList();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getList();
  }, [])

  return (
    <div className='MainContainer'>
      <div className={'HeaderContainer'}>
        <input value={value} onChange={changeHandler} />
        <button onClick={createHandler}>Create</button>
      </div>
      <div className='MainContainer'>
        {list?.map((item) => {
          return (
            <div key={item?._id} className='HeaderContainer'>
              <div>{item?.title}</div>
              <div><button onClick={() => deleteItem(item?._id)}>Delete</button></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
