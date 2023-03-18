import axios from "axios";

export default axios.create({
    baseURL: process.env.REACT_APP_API_HOST,//+":"+process.env.REACT_APP_API_PORT,
    headers: {
        "Content-type": "application/json"
    }
});
//console.log("api.ts : ENV : " + process.env.REACT_APP_API_HOST+":"+process.env.REACT_APP_API_PORT);