import api from './ApiService';

const toAbsoluteUrl = (url) => {
  if (!url) {
    return url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${api.defaults.baseURL}${url}`;
};

export const uploadListingImages = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await api.post('/api/uploads/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return (response.data.urls || []).map(toAbsoluteUrl);
};

export default {
  uploadListingImages,
};
