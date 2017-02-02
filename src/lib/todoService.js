const baseUrl = 'http://localhost:8080/todos';

export const loadTodos = () => {
    return fetch(baseUrl)           // returns Promise
        .then(res => res.json());   // use response object to convert to JSON
};

export const createTodo = (todo) => {
    return fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    }).then(res => res.json());

};