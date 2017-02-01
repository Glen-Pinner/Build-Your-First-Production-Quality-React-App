export const partial = (fn, ...args) => fn.bind(null, ...args); // args to lambda uses spread, args to bind uses rest

const _pipe = (f, g) => (...args) => g(f(...args));

export const pipe = (...fns) => fns.reduce(_pipe);