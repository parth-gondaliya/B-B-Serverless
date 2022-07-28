import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Navbar } from "../components";
import { useAuth } from "../context";
import {
  Home,
  Kitchen,
  Login,
  Signup,
  Profile,
  CaesarCipher,
  QAPage,
  Feedback,
  DisplayFeedback,
  Tour,
  DisplayTours,
  Visualization
} from "../pages";
import KommunicateChat from "../chat";

const AppRoutes = () => {
  const { isLogin } = useAuth();
  console.log({ isLogin });
  return (
    <Routes>
      <Route element={<WithoutNavbar />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/qa-challenge" element={<QAPage />} />
        <Route path="/caesar-cipher" element={<CaesarCipher />} />
      </Route>
      <Route
        path="*"
        element={
          <RequireAuth>
            <ProtectedRoutes />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route element={<WithNavbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<Signup />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/display-feedback" element={<DisplayFeedback />} />
        <Route path="/display-tours" element={<DisplayTours />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
};

const RequireAuth = ({ children }) => {
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const WithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <KommunicateChat />
    </>
  );
};

const WithoutNavbar = () => <Outlet />;

export default AppRoutes;
