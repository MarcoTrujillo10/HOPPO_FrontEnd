import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/api";

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

const mapUserPayload = (userPayload) => {
  if (!userPayload) return null;
  return {
    id: userPayload.id,
    email: userPayload.email,
    username: userPayload.username,
    firstName: userPayload.name,
    lastName: userPayload.lastName,
    role: userPayload.role,
  };
};

const getInitialAuthState = () => {
  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
  const savedUserRaw = localStorage.getItem(STORAGE_USER_KEY);
  let savedUser = null;
  if (savedUserRaw) {
    try {
      savedUser = JSON.parse(savedUserRaw);
    } catch (_) {
      savedUser = null;
    }
  }
  return {
    user: savedUser,
    token: savedToken,
    loading: false,
    error: null,
    initializing: true,
  };
};

const persistAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }
  if (user) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
};

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return mapUserPayload(response.data);
    } catch (error) {
      if (error?.response?.status === 401) {
        return rejectWithValue("Sesión expirada, por favor inicia sesión");
      }
      return rejectWithValue("Error al cargar el perfil");
    }
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { access_token: accessToken, user: rawUser } = response.data;
      const mappedUser = mapUserPayload(rawUser);
      persistAuthData({ token: accessToken, user: mappedUser });
      return { token: accessToken, user: mappedUser };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al iniciar sesión"
      );
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authService.register(payload);
      const { access_token: accessToken, user: rawUser } = response.data;
      if (accessToken && rawUser) {
        const mappedUser = mapUserPayload(rawUser);
        persistAuthData({ token: accessToken, user: mappedUser });
        return { token: accessToken, user: mappedUser };
      }
      return { token: null, user: null };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al registrar usuario"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  persistAuthData({ token: null, user: null });
  return { token: null, user: null };
});

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthError(state) {
      state.error = null;
    },
    completeInitialization(state) {
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.user = action.payload;
        if (!state.token) {
          persistAuthData({ token: null, user: null });
        } else {
          persistAuthData({ token: state.token, user: state.user });
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.initializing = false;
        state.error = action.payload || action.error.message;
        if (action.payload) {
          state.user = null;
          state.token = null;
          persistAuthData({ token: null, user: null });
        }
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.initializing = false;
      });
  },
});

export const { resetAuthError, completeInitialization } = authSlice.actions;

export const selectAuthState = (state) => state.auth;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.user && state.auth.token);
export const selectHasRole = (role) => (state) =>
  state.auth.user?.role === role;

export default authSlice.reducer;


