const baseUrl = 'http://localhost:8080/todos';

export const loadTodos = () => {
    return fetch(baseUrl)           // returns Promise
        .then(res => res.json());   // use response object to convert to JSON
};
