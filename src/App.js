import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {TodoForm, TodoList, Footer} from './components/todo';
import {addTodo, generateId, findById, toggleTodo, updateTodo, removeTodo, filterTodos} from './lib/todoHelpers';
import {pipe, partial} from './lib/utils';
import {loadTodos, createTodo, saveTodo, destroyTodo} from './lib/todoService';


class App extends Component {

    // Instance variable(s) on this class using property initializer syntax
    state = {
        todos: [],
        currentTodo: ''
    };

    static contextTypes = {
        route: React.PropTypes.string
    };

    componentDidMount() {
        loadTodos()
            .then(todos => this.setState({todos}));
    }

    handleRemove = (id, event) => {
        event.preventDefault();

        const updatedTodos = removeTodo(this.state.todos, id);

        this.setState({ todos: updatedTodos });

        // Update on JSON server
        destroyTodo(id)
            .then(() => this.showTempMessage('Todo removed'));
    };

    handleToggle = (id) => {
        const getToggledTodo = pipe(findById, toggleTodo);
        const updated = getToggledTodo(id, this.state.todos);
        const getUpdatedTodos = partial(updateTodo, this.state.todos);
        const updatedTodos = getUpdatedTodos(updated);

        // const todo = findById(id, this.state.todos);
        // const toggled = toggleTodo(todo);
        // const updatedTodos = updateTodo(this.state.todos, toggled);

        this.setState({ todos: updatedTodos });

        // Update on JSON server
        saveTodo(updated)
            .then(() => this.showTempMessage('Todo updated'));
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

        // Update on JSON server
        createTodo(newTodo)
            .then(() => this.showTempMessage('Todo added'));
    };

    showTempMessage = (msg) => {
        this.setState({message: msg});
        setTimeout(() => this.setState({message: ''}), 2500);
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
        const displayTodos = filterTodos(this.state.todos, this.context.route);

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>React Todos</h2>
                </div>
                <div className="Todo-App">
                    {this.state.errorMessage && <span className="error">{this.state.errorMessage}</span>}
                    {this.state.message && <span className="success">{this.state.message}</span>}
                    <TodoForm
                        handleInputChange={this.handleInputChange}
                        currentTodo={this.state.currentTodo}
                        handleSubmit={submitHandler}
                    />
                    <TodoList
                        handleToggle={this.handleToggle}
                        todos={displayTodos}
                        handleRemove={this.handleRemove}
                    />
                    <Footer/>
                </div>
            </div>
        );
    }
}

export default App;
