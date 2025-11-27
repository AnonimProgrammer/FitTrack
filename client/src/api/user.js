import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const { data } = await axiosInstance.get('/user/me');
  return data;
};

export const updateProfile = async (fullname, email, bio) => {
  const { data } = await axiosInstance.put('/user/me', { fullname, email, bio });
  return data;
};

export const resetData = async () => {
  const { data } = await axiosInstance.post('/user/reset');
  return data;
};

export const deleteAccount = async () => {
  const { data } = await axiosInstance.delete('/user');
  return data;
};
