const API = process.env.REACT_APP_API_URL;

export const get = async (endpoint) => {
  const res = await fetch(`${API}${endpoint}`);
  return await res.json();
};

export const post = async (endpoint, body) => {
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
};

export const del = async (endpoint) => {
  const res = await fetch(`${API}${endpoint}`, {
    method: "DELETE",
  });
  return await res.json();
};


export const put = async (endpoint, body) => {
  const res = await fetch(`${API}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
};
