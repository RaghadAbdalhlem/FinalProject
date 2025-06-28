import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import { getHomeRouteForLoggedInUser, getUserData } from './utils/Utils';
import RequiredUser from './components/RequiredUser';
import { Suspense } from 'react';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EndUserDashboard from './pages/end-user/EndUserDashboard';
import Profile from './pages/end-user/Profile';
import RecipesList from './pages/end-user/RecipesList';
import RecipeDetails from './pages/end-user/RecipeDetail';
import ContentRegister from './pages/auth/ContentRegister';
import UserRegister from './pages/auth/UserRegister';
import ContentRecipes from './pages/content/ContentRecipes';
import ContentRecipeCreate from './pages/content/ContentRecipeCreate';
import ContentRecipeUpdate from './pages/content/ContentRecipeUpdate';
import ContentProducts from './pages/content/ContentProducts';
import ContentProductCreate from './pages/content/ContentProductCreate';
import ContentProductUpdate from './pages/content/ContentProductUpdate';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserCreate from './pages/admin/AdminUserCreate';
import AdminUserUpdate from './pages/admin/AdminUserUpdate';
import AdminLogin from './pages/auth/AdminLogin';
import AdminRecipes from './pages/admin/AdminRecipes';
import AdminProducts from './pages/admin/AdminProducts';
import AdminRecipeDetail from './pages/admin/AdminRecipeDetail';
import AdminProductDetail from './pages/admin/AdminProductDetail';
import Favorites from './pages/end-user/Favorites';
import Shop from './pages/end-user/Shop';
import ShopDetail from './pages/end-user/ShopDetail';
import MyCart from './pages/end-user/MyCarts';
import Order from './pages/end-user/Order';

const App = () => {
  const getHomeRoute = () => {
    const user = getUserData();
    if (user) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  return (
    <Suspense fallback={null}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getHomeRoute()} />

          <Route element={<RequiredUser allowedRoles={['user']} />}>
            <Route path="user/dashboard" element={<EndUserDashboard />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="user/recipes" element={<RecipesList />} />
            <Route path="user/recipes/detail/:id" element={<RecipeDetails />} />
            <Route path="user/favorites" element={<Favorites />} />
            <Route path="user/shop" element={<Shop />} />
            <Route path="user/shop/view/:id" element={<ShopDetail />} />
            <Route path="user/mycart" element={<MyCart />} />
            <Route path="user/order" element={<Order />} />
          </Route>
          <Route element={<RequiredUser allowedRoles={['content-manager']} />}>
            <Route path="content-manager/recipes" element={<ContentRecipes />} />
            <Route path="content-manager/recipes/create" element={<ContentRecipeCreate />} />
            <Route path="content-manager/recipes/update/:id" element={<ContentRecipeUpdate />} />
            <Route path="content-manager/products" element={<ContentProducts />} />
            <Route path="content-manager/products/create" element={<ContentProductCreate />} />
            <Route path="content-manager/products/update/:id" element={<ContentProductUpdate />} />
          </Route>
          <Route element={<RequiredUser allowedRoles={['admin']} />}>
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/users/create" element={<AdminUserCreate />} />
            <Route path="admin/users/update/:id" element={<AdminUserUpdate />} />
            <Route path="admin/recipes" element={<AdminRecipes />} />
            <Route path="admin/recipes/detail/:id" element={<AdminRecipeDetail />} />
            <Route path="admin/products" element={<AdminProducts />} />
            <Route path="admin/products/detail/:id" element={<AdminProductDetail />} />
          </Route>
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="register-content" element={<ContentRegister />} />
        <Route path="register-user" element={<UserRegister />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;
