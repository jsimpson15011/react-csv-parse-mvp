import axios from "axios";

const base = import.meta.env.VITE_BACKEND_BASE;

const client =  {
    postCSV: async (data:object) => {
        const res =  await axios.post(`${base}/csv`,data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return(res);
    },

    getUsers: async () => {
        return await axios.get(`${base}/users`);
    }
}

export default client;
