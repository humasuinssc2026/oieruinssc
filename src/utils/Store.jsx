import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [materialsPage, setMaterialsPage] = useState(1);
  const [hasMoreMaterials, setHasMoreMaterials] = useState(true);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [categories, setCategories] = useState({ fakultas: [], prodi: [] });

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  const [theme, setTheme] = useState('light');

  // Load from local storage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAdminAuthenticated(true); // For backward compatibility with routes
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    fetchMaterials(1, false);
    
    // Fetch categories to map prodi to fakultas globally
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories({ fakultas: data.data.fakultasList, prodi: data.data.prodiList });
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const fetchMaterials = async (page = 1, append = false, filters = {}) => {
    setIsLoadingMaterials(true);
    try {
      const queryParams = new URLSearchParams({ page, limit: 12 });
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/materials?${queryParams.toString()}`);
      const data = await response.json();
      if (data.success) {
        const fetchedVideos = data.data.filter(m => m.type === 'video');
        const fetchedDocs = data.data.filter(m => m.type === 'document');
        
        if (append) {
          setVideos(prev => [...prev, ...fetchedVideos]);
          setDocuments(prev => [...prev, ...fetchedDocs]);
        } else {
          setVideos(fetchedVideos);
          setDocuments(fetchedDocs);
        }
        
        setHasMoreMaterials(page < data.pagination.totalPages);
        setMaterialsPage(page);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  const loadMoreMaterials = (filters = {}) => {
    if (!isLoadingMaterials && hasMoreMaterials) {
      fetchMaterials(materialsPage + 1, true, filters);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchBookmarks();
    }
  }, [token]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setBookmarks(data.data.map(b => b.material_id));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const toggleBookmark = async (materialId) => {
    if (!token) {
      alert("Silakan login terlebih dahulu untuk menyimpan materi.");
      return false;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/bookmarks/${materialId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        if (data.is_bookmarked) {
          setBookmarks([...bookmarks, materialId]);
        } else {
          setBookmarks(bookmarks.filter(id => id !== materialId));
        }
        return data.is_bookmarked;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
    return false;
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const loginAdmin = (userData, jwtToken) => {
    setToken(jwtToken);
    setUser(userData);
    setIsAdminAuthenticated(true);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logoutAdmin = () => {
    setToken(null);
    setUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Refresh function exposed to context
  const refreshMaterials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/materials`);
      const data = await response.json();
      if (data.success) {
        const fetchedVideos = data.data.filter(m => m.type === 'video');
        const fetchedDocs = data.data.filter(m => m.type === 'document');
        setVideos(fetchedVideos);
        setDocuments(fetchedDocs);
      }
    } catch (error) {
      console.error('Error refreshing materials:', error);
    }
  };

  const addVideo = (video) => {
    refreshMaterials();
  };

  const addDocument = (doc) => {
    refreshMaterials();
  };

  const value = {
    isAdminAuthenticated,
    user,
    token,
    loginAdmin,
    logoutAdmin,
    videos,
    addVideo,
    documents,
    addDocument,
    refreshMaterials,
    setVideos,
    setDocuments,
    theme,
    toggleTheme,
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchMaterials,
    loadMoreMaterials,
    hasMoreMaterials,
    isLoadingMaterials,
    categories,
    bookmarks,
    toggleBookmark,
    fetchBookmarks
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
