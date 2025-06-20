import { Navigate } from "react-router-dom";
import useUserStore from "@/stores/user-store";

export default function ProtectedRoute({ children }) {
  const isLogin = useUserStore((state) => state.isLogin);

  if (isLogin) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
