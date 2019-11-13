import React from 'react';
import ReactDOM from 'react-dom';
import { types, getSnapshot, applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react';
import { values } from 'mobx';

// let id = 1;

const randomId = () => Math.floor(Math.random() * 1000).toString(36);

const Todo = types
    .model({
        // id: types.identifierNumber,
        name: types.optional(types.string, ''),
        done: types.optional(types.boolean, false)
    })
    .actions(self => ({
        setName(newName) {
            self.name = newName
        },
        toggle() {
            self.done = !self.done
        }
    }))

const User = types.model({
    name: types.optional(types.string, '')
})

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.optional(types.map(Todo), {})
    })
    .views(self => ({
        get pendingCount() {
            return values(self.todos).filter(todo => !todo.done).length
        },
        get completedCount() {
            return values(self.todos).filter(todo => todo.done).length
        }
    }))
    .actions(self => ({
        addTodo(id, name) {
            self.todos.set(id, Todo.create({ id, name }))
        }
    }))

const store = RootStore.create({
    users: {},
    todos: {
        "1": {
            // id: id,
            name: 'Eat a cake',
            done: true
        }
    }
})

// applySnapshot(store, {
//     users: {},
//     todos: {
//         '1': {
//             name: 'Eat a cake',
//             done: true
//         }
//     }
// })

const TodoView =  observer(props => (
    <div>
        <input 
            type='checkbox'
            checked={props.todo.done}
            onChange={e => props.todo.toggle()}
        />
        <input 
            type='text'
            value={props.todo.name}
            onChange={e => props.todo.setName(e.target.value)}
        />
    </div>
))

const TodoCounterView = observer(props => (
    <div>
        {props.store.pendingCount} pending, {props.store.completedCount} completed
    </div>
))

const AppView = observer(props => (
    <div>
        <button onClick={e => props.store.addTodo(randomId(), "New Task")}>
            Add Task
        </button>
        {values(props.store.todos).map(todo => (
               <TodoView todo={todo}/>
        ))}
        <TodoCounterView store={props.store}/>
    </div>
))

// store.addTodo(1, 'Eat a cake') // set value in store
// store.addTodo(2, 'Take job')
// store.todos.get(1).toggle() // toggle done in store
// store.todos.get(2).toggle()

// const john = User.create()
// const eat = Todo.create({name: 'eat'})

// onSnapshot(store, snapshot => console.log(snapshot))

// console.log('John:', getSnapshot(john))
// console.log('Eat TODO:', getSnapshot(eat))
// console.log(getSnapshot(store))


ReactDOM.render(
    <AppView store={store} />,
    // <div>
    //     {JSON.stringify(getSnapshot(store))}
    // </div>,
    document.getElementById('root')
);








// import React from 'react';
// import ReactDOM from 'react-dom';
// // import './index.css';
// import App from './App';
// // import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
