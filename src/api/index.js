// API client for Prescripto frontend
const getToken = () => localStorage.getItem('prescripto_token');

const request = async (path, opts = {}) => {
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(path, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let json;
    try { json = JSON.parse(text); } catch (e) { json = { message: text }; }
    const err = new Error(json.message || 'Request failed');
    err.response = json;
    throw err;
  }
  return res.json().catch(() => ({}));
};

export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const signup = (name, email, password) => request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
export const getDoctors = (specialty) => request(`/doctors${specialty ? `?specialty=${encodeURIComponent(specialty)}` : ''}`);
export const getDoctor = (id) => request(`/doctors/${id}`);
export const createAppointment = (doctorId, date, slot) => request('/appointments', { method: 'POST', body: JSON.stringify({ doctorId, date, slot }) });
export const getAppointments = () => request('/appointments');
export const deleteAppointment = (id) => request(`/appointments/${id}`, { method: 'DELETE' });
export const getAdminAppointments = () => request('/admin/appointments');
export const getDoctorAppointments = () => request('/doctor/appointments');
export const getDoctorProfile = () => request('/doctor/profile');
export const createDoctor = (data) => request('/doctors', { method: 'POST', body: JSON.stringify(data) });
export const getProfile = () => request('/auth/me');
export const updateProfile = (data) => request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
export const updateAppointment = (id, data) => request(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const updateDoctor = (id, data) => request(`/doctors/${id}`, { method: 'PATCH', body: JSON.stringify(data) });

const api = { login, signup, getDoctors, getDoctor, createAppointment, getAppointments, deleteAppointment, getAdminAppointments, getDoctorAppointments, getDoctorProfile, createDoctor, getProfile, updateProfile, updateAppointment, updateDoctor };
export default api;
