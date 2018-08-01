const DEBUG = "service:test:*,helper:test:*";

console.log(DEBUG);

const namespaces = DEBUG.split(/[\s,]+/).reduce((acc, namespace) => {
  if (!namespace) {
    return acc;
  }

  const regex = new RegExp(`^${namespace.replace(/\*/g, ".*?")}$`);
  acc.push(regex);
  return acc;
}, []);

console.log(namespaces);

const myspace = "service:test2:add";
const res = namespaces.some(namespace => myspace.match(namespace));

console.log(res);
