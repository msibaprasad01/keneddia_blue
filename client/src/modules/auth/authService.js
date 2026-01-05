/**
 * Mock Authentication Service
 * Handles static login validation for admin and user roles
 */

// Mock user database
const MOCK_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'Super Admin',
    type: 'admin'
  },
  manager: {
    username: 'manager',
    password: 'manager123',
    role: 'Admin',
    type: 'admin'
  },
  user: {
    username: 'user',
    password: 'user123',
    type: 'user'
  }
};

/**
 * Validates login credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @param {string} credentials.loginType - 'admin' or 'user'
 * @param {string} [credentials.role] - Required for admin login
 * @returns {Object} Authentication result
 */
export const login = (credentials) => {
  const { username, password, loginType, role } = credentials;

  // Find matching user
  const user = Object.values(MOCK_USERS).find(
    u => u.username === username && u.password === password
  );

  // User not found
  if (!user) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }

  // Validate login type matches user type
  if (user.type !== loginType) {
    return {
      success: false,
      message: `This account is not authorized for ${loginType} login`
    };
  }

  // For admin login, validate role
  if (loginType === 'admin') {
    if (!role) {
      return {
        success: false,
        message: 'Please select a role'
      };
    }

    if (user.role !== role) {
      return {
        success: false,
        message: 'Invalid role selected for this account'
      };
    }
  }

  // Successful login
  return {
    success: true,
    message: 'Login successful',
    user: {
      username: user.username,
      type: user.type,
      role: user.role
    }
  };
};

/**
 * Logs out the current user
 * @returns {Object} Logout result
 */
export const logout = () => {
  return {
    success: true,
    message: 'Logged out successfully'
  };
};
