import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';
import userReducer from './api/userSlice';
import { recipeAPI } from './api/recipeAPI';
import { productAPI } from './api/productAPI';
import { userAPI } from './api/userAPI';
import { favoriteAPI } from './api/favoriteAPI';
import { cartAPI } from './api/cartAPI';
import { recommendAPI } from './api/recommendAPI';
import { orderAPI } from './api/orderAPI';

export const store = configureStore({
    reducer: {
        [authAPI.reducerPath]: authAPI.reducer,
        [getMeAPI.reducerPath]: getMeAPI.reducer,
        [recipeAPI.reducerPath]: recipeAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [userAPI.reducerPath]: userAPI.reducer,
        [favoriteAPI.reducerPath]: favoriteAPI.reducer,
        [cartAPI.reducerPath]: cartAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [recommendAPI.reducerPath]: recommendAPI.reducer,
        userState: userReducer
    },
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([
            authAPI.middleware,
            getMeAPI.middleware,
            recipeAPI.middleware,
            productAPI.middleware,
            userAPI.middleware,
            favoriteAPI.middleware,
            cartAPI.middleware,
            orderAPI.middleware,
            recommendAPI.middleware,
        ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
