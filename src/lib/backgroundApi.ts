import api from './axios';

// --- Screen Background Services ---

export const getScreenBackground = async (screenName: string) => {
    try {
        const response = await api.get(`/api/screen-background/${screenName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching background for ${screenName}:`, error);
        return null;
    }
};

export const updateScreenBackground = async (screenName: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await api.post(`/api/screen-background/${screenName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating background for ${screenName}:`, error);
        throw error;
    }
};
