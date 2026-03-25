const baseUrl = 'http://test.edu/manager_be';

const fetchApi = async (url, method = 'GET', body = null) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, options);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchApi
