import {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  loginThunk,
  registerThunk,
  logoutThunk,
  selectAuthState,
  selectIsAuthenticated,
  resetAuthError,
  completeInitialization,
} from "../redux/authSlice";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return error.message || fallback;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector(selectAuthState);
  const isAuthenticatedSelector = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (_) {
        // already handled in slice
      } finally {
        dispatch(completeInitialization());
          }
    };
    bootstrapAuth();
  }, [dispatch]);

  const login = useCallback(
    async (credentials) => {
    try {
        const result = await dispatch(loginThunk(credentials)).unwrap();
        return { success: true, data: result };
      } catch (err) {
      return {
        success: false,
          error: getErrorMessage(err, "Error al iniciar sesión"),
      };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (payload) => {
    try {
        const result = await dispatch(registerThunk(payload)).unwrap();
        return { success: true, data: result };
      } catch (err) {
      return {
        success: false,
          error: getErrorMessage(err, "Error al registrar usuario"),
      };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/");
  }, [dispatch, navigate]);

  const hasRole = useCallback(
    (role) => selectHasRole(role)({ auth: authState }),
    [authState]
  );

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      loading: authState.loading || authState.initializing,
      error: authState.error,
      login,
      register,
      logout,
      isAuthenticated: () => isAuthenticatedSelector,
      hasRole,
      clearAuthError: () => dispatch(resetAuthError()),
    }),
    [
      authState,
    login,
    register,
    logout,
      isAuthenticatedSelector,
    hasRole,
      dispatch,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
