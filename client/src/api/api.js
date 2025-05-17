const API = process.env.REACT_APP_API_URL;

export const get = async (path) => {
  const res = await fetch(`${API}${path}`);
  return res.json();
};

export const post = async (path, data) => {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const del = async (path) => {
  const res = await fetch(`${API}${path}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const put = async (path, data) => {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
