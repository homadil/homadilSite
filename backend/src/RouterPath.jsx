import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import SignUP from "./pages/Auth/SignUP";
import SignIn from "./pages/Auth/SignIn";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ForgetPasswordConfirm from "./pages/Auth/ForgetPasswordConfirm";
import ResetEmail from "./pages/Auth/ResetEmail";
import ResetEmailConfirm from "./pages/Auth/ResetEmailConfirm";
import NotFound from "./pages/NotFound";
import UserEdit from "./pages/Auth/UserEdit";

export default function RouterPath() {
  return (
    <Routes>
      <Route path="/" index element={<SignIn />} />

      {/* admin path */}
      <Route path="/admin" element={<Admin />} />

      {/* auth path  */}
      <Route path="/sign_up" element={<SignUP />} />
      <Route path="/sign_in" element={<SignIn />} />
      <Route path="/user_edit" element={<UserEdit />} />
      <Route path="/forget_password" element={<ForgetPassword />} />
      <Route
        path="/forget_password_confirm"
        element={<ForgetPasswordConfirm />}
      />
      <Route path="/reset_email" element={<ResetEmail />} />
      <Route path="/reset_email_Confirm" element={<ResetEmailConfirm />} />

      {/* Fallback 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
