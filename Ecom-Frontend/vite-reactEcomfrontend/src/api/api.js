/**
 * @file Centralized Axios instance for all backend API communication.
 *
 * @description
 * - Base URL is built from the VITE_BACK_END_URL environment variable with "/api" appended.
 * - `withCredentials: true` ensures HTTP-only cookies (session/JWT) are sent with every request,
 *   enabling cookie-based authentication without manual Authorization headers.
 *
 * @usage Imported by every Redux action creator in `store/actions/index.js`.
 *        All public, user, admin, and seller endpoints flow through this single instance.
 *
 * @requires VITE_BACK_END_URL - Must be defined in the project's .env file.
 */
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
  //The code below allows the front-end  to include cookies with the
  //request it is working with
  withCredentials:true,
});

export default api;

