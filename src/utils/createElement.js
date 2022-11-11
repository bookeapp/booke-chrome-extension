const createElement = (nodeName, attr, ...children) => {
  const element = document.createElement(nodeName);

  Object.keys(attr).forEach((key) => {
    element[key] = attr[key];
  });

  children.forEach((child) => {
    element.appendChild(child);
  });

  return element;
};

export default createElement;
