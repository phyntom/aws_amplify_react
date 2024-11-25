/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { generateClient } from 'aws-amplify/api';
import { listTodos } from './graphql/queries';
import { createTodo } from './graphql/mutations';

const client = generateClient();

function App({ signOut, user }) {
  const [count, setCount] = useState(0);
  const [todo, setTodo] = useState({
    name: '',
    description: '',
    completed: false,
  });
  const [todos, setTodos] = useState([]);

  async function submitTodo(e) {
    e.preventDefault();
    const { name, description, completed } = e.target;

    const result = await client.graphql({
      query: createTodo,
      variables: {
        input: {
          name: name.value,
          description: description.value,
          completed: completed.value,
        },
      },
    });
    const response = await result;
    if(response){
    const dataResult = await client.graphql({ query: listTodos });
    const todos = await dataResult.data.listTodos.items;
    setTodos(todos);
    }
  }

  useEffect(() => {
    async function fetchTodos() {
      const result = await client.graphql({ query: listTodos });
      const todos = await result.data.listTodos.items;
      setTodos(todos);
    }
    fetchTodos();
  }, []);

  return (
    <>
      <main>
        <div>
          <p>Sign in as {user.username}</p>
          <a href='https://vite.dev' target='_blank'>
            <img src={viteLogo} className='logo' alt='Vite logo' />
          </a>
          <a href='https://react.dev' target='_blank'>
            <img src={reactLogo} className='logo react' alt='React logo' />
          </a>
        </div>
        <h1>Vite + React</h1>
        <button onClick={signOut}>Sign out</button>
        <div className='card'>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <form onSubmit={submitTodo}>
            <label>
              Name
              <input
                type='text'
                name='name'
                placeholder='name'
                value={todo.name}
                onChange={(e) => {
                  setTodo({ ...todo, name: e.target.value });
                }}
              />
            </label>
            <label>
              Description
              <input
                type='text'
                name='description'
                placeholder='Description'
                value={todo.description}
                onChange={(e) => {
                  setTodo({ ...todo, description: e.target.value });
                }}
              />
            </label>
            <input
              type='checkbox'
              name='completed'
              checked={todo.completed}
              value={todo.completed}
              onChange={(e) => {
                setTodo({ ...todo, completed: e.target.value });
              }}
            />
            <button>Submit</button>
          </form>
          {todos.map((todo) => (
            <div key={todo.id} className='todo'>
              <h1 className='todo-header'>{todo.name}</h1>
              <p className='todo-body'>{todo.description}</p>
            </div>
          ))}
        </div>
        <p className='read-the-docs'>
          Click on the Vite and React logos to learn more
        </p>
      </main>
    </>
  );
}

export default App;
