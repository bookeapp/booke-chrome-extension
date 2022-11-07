const MOCK = {
  get: {
    "/api/businesses": {
      data: []
    }
  },
  post: {}
};

const fakeFetch = (...args) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      cb(...args);
    }, Math.random() * 300 + 100);
  });
};

const client = {
  get(url) {
    return fakeFetch(MOCK.get[url]);
  },
  post(url, payload) {
    return fakeFetch(MOCK.post[url], payload);
  }
};

export default client;
