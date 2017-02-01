import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo} from './lib/todoHelpers';
import {pipe, partial} from './lib/utils';

class App extends Component {

    // Instance variable(s) on this class using property initializer syntax
    state = {
        todos: [
            {id: 1, name: 'Learn JSX', isComplete: true},
            {id: 2, name: 'Build an Awesome App', isComplete: false},
            {id: 3, name: 'Ship It!', isComplete: false}
        ],
        currentTodo: ''
    };

    handleRemove = (id, event) => {
        event.preventDefault();

        const updatedTodos = removeTodo(this.state.todos, id);

        this.setState({ todos: updatedTodos });
    };

    handleToggle = (id) => {
        const getUpdatedTodos = pipe(findById, toggleTodo, partial(updateTodo, this.state.todos));
        const updatedTodos = getUpdatedTodos(id, this.state.todos);

        // const todo = findById(id, this.state.todos);
        // const toggled = toggleTodo(todo);
        // const updatedTodos = updateTodo(this.state.todos, toggled);

        this.setState({ todos: updatedTodos });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const newId = generateId();
        const newTodo = {
            id: newId,
            name: this.state.currentTodo,
            isComplete: false
        };
        const updatedTodos = addTodo(this.state.todos, newTodo);

        this.setState({
            todos: updatedTodos,
            currentTodo: '',
            errorMessage: ''
        });
    };

    handleEmptySubmit = (event) => {
        event.preventDefault();

        this.setState({
            errorMessage: 'Please supply a todo name'
        });
    };

    handleInputChange = (event) => {
        this.setState({
            currentTodo: event.target.value
        });
    };

    render() {
        const submitHandler = this.state.currentTodo ? this.handleSubmit : this.handleEmptySubmit;

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>React Todos</h2>
                </div>
                <div className="Todo-App">
                    {this.state.errorMessage && <span className="error">{this.state.errorMessage}</span>}
                    <TodoForm
                        handleInputChange={this.handleInputChange}
                        currentTodo={this.state.currentTodo}
                        handleSubmit={submitHandler}
                    />
                    <TodoList
                        handleToggle={this.handleToggle}
                        todos={this.state.todos}
                        handleRemove={this.handleRemove}
                    />
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default App;
