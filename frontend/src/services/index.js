import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
};

export const userService = {
  getUsers: () => api.get('/users/'),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, data) => api.put(`/users/${id}/update/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/delete/`),
};

export const ticketService = {
  getTickets: (params) => api.get('/tickets/', { params }),
  getTicket: (id) => api.get(`/tickets/${id}/`),
  createTicket: (data) => api.post('/tickets/', data),
  updateTicket: (id, data) => api.put(`/tickets/${id}/update/`, data),
  updateTicketStatus: (id, status) => api.patch(`/tickets/${id}/status/`, { status }),
  deleteTicket: (id) => api.delete(`/tickets/${id}/delete/`),
};

export const commentService = {
  getComments: (ticketId) => api.get(`/comments/ticket/${ticketId}/`),
  getComment: (id) => api.get(`/comments/${id}/`),
  createComment: (data) => api.post('/comments/ticket/', data),
  updateComment: (id, data) => api.put(`/comments/${id}/update/`, data),
  deleteComment: (id) => api.delete(`/comments/${id}/delete/`),
};

export const notificationService = {
  getNotifications: () => api.get('/tickets/notifications/'),
};
