import axiosInstance from './axiosInstance';

export const register = async (fullname, email, password) => {
  const { data } = await axiosInstance.post('/auth/register', { fullname, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data;
};
