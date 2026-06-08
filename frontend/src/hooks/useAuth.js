import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
  logout as logoutAction,
  updateUser,
} from '../features/auth/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from '../features/auth/authApi';
import { clearGuestCart } from '../features/cart/cartSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAccessToken);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (credentials) => {
    return await loginMutation(credentials).unwrap();
  };

  const register = async (userData) => {
    return await registerMutation(userData).unwrap();
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      dispatch(logoutAction());
      dispatch(clearGuestCart());
    }
  };

  const updateProfileState = (updatedData) => {
    dispatch(updateUser(updatedData));
  };

  return {
    user,
    isAuthenticated,
    token,
    isCustomer: user?.role === 'customer',
    isSeller: user?.role === 'seller',
    isAdmin: user?.role === 'admin',
    isLoggingIn,
    isRegistering,
    login,
    register,
    logout,
    updateProfileState,
  };
};

export default useAuth;
