const getLocalStorageItem = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    console.error('Error reading localStorage key ' + key, e);
    return defaultVal;
  }
};

const setLocalStorageItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error writing localStorage key ' + key, e);
  }
};

export const localDb = {
  auth: {
    isAuthenticated: async () => true,
    me: async () => ({ id: 'local_user', email: 'user@local.phone', name: 'Local User' }),
    logout: (redirectUrl) => {
      console.log('Local logout');
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (redirectUrl) => {
      console.log('Local login redirect');
      if (redirectUrl) window.location.href = redirectUrl;
    }
  },
  entities: {
    HiddenContact: {
      list: async (sort, limit) => {
        const list = getLocalStorageItem('b44_hidden_contacts', []);
        // Sort descending by created_date or hiddenAtTimestamp
        const sorted = [...list].sort((a, b) => {
          const dateA = new Date(a.hiddenAtTimestamp || a.created_date || 0);
          const dateB = new Date(b.hiddenAtTimestamp || b.created_date || 0);
          return dateB - dateA;
        });
        return sorted.slice(0, limit || 50);
      },
      filter: async (query) => {
        const list = getLocalStorageItem('b44_hidden_contacts', []);
        return list;
      },
      create: async (data) => {
        const list = getLocalStorageItem('b44_hidden_contacts', []);
        const newItem = {
          id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          created_date: new Date().toISOString(),
          ...data
        };
        list.push(newItem);
        setLocalStorageItem('b44_hidden_contacts', list);
        return newItem;
      },
      update: async (id, data) => {
        const list = getLocalStorageItem('b44_hidden_contacts', []);
        const updatedList = list.map(item => item.id === id ? { ...item, ...data } : item);
        setLocalStorageItem('b44_hidden_contacts', updatedList);
        return updatedList.find(item => item.id === id);
      },
      delete: async (id) => {
        const list = getLocalStorageItem('b44_hidden_contacts', []);
        const filtered = list.filter(item => item.id !== id);
        setLocalStorageItem('b44_hidden_contacts', filtered);
        return { success: true };
      }
    },
    PartySession: {
      filter: async (query) => {
        const list = getLocalStorageItem('b44_party_sessions', []);
        return list.filter(item => {
          if (query && 'isActive' in query) {
            return item.isActive === query.isActive;
          }
          return true;
        });
      },
      list: async (sort, limit) => {
        const list = getLocalStorageItem('b44_party_sessions', []);
        return list.slice(0, limit || 50);
      },
      create: async (data) => {
        const list = getLocalStorageItem('b44_party_sessions', []);
        const newItem = {
          id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          created_date: new Date().toISOString(),
          isActive: true,
          ...data
        };
        list.push(newItem);
        setLocalStorageItem('b44_party_sessions', list);
        return newItem;
      },
      update: async (id, data) => {
        const list = getLocalStorageItem('b44_party_sessions', []);
        const updatedList = list.map(item => item.id === id ? { ...item, ...data } : item);
        setLocalStorageItem('b44_party_sessions', updatedList);
        return updatedList.find(item => item.id === id);
      },
      delete: async (id) => {
        const list = getLocalStorageItem('b44_party_sessions', []);
        const filtered = list.filter(item => item.id !== id);
        setLocalStorageItem('b44_party_sessions', filtered);
        return { success: true };
      }
    },
    AccessAttemptLog: {
      list: async (sort, limit) => {
        const list = getLocalStorageItem('b44_access_logs', []);
        const sorted = [...list].sort((a, b) => {
          const dateA = new Date(a.attemptTimestamp || 0);
          const dateB = new Date(b.attemptTimestamp || 0);
          return dateB - dateA;
        });
        return sorted.slice(0, limit || 50);
      },
      filter: async (query) => {
        const list = getLocalStorageItem('b44_access_logs', []);
        return list;
      },
      create: async (data) => {
        const list = getLocalStorageItem('b44_access_logs', []);
        const newItem = {
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          attemptTimestamp: new Date().toISOString(),
          ...data
        };
        list.push(newItem);
        setLocalStorageItem('b44_access_logs', list);
        return newItem;
      },
      update: async (id, data) => {
        const list = getLocalStorageItem('b44_access_logs', []);
        const updatedList = list.map(item => item.id === id ? { ...item, ...data } : item);
        setLocalStorageItem('b44_access_logs', updatedList);
        return updatedList.find(item => item.id === id);
      },
      delete: async (id) => {
        const list = getLocalStorageItem('b44_access_logs', []);
        const filtered = list.filter(item => item.id !== id);
        setLocalStorageItem('b44_access_logs', filtered);
        return { success: true };
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' })
    }
  }
};

// Expose globally so that any globalThis.__B44_DB__ reference gets overwritten
globalThis.__B44_DB__ = localDb;
export default localDb;
