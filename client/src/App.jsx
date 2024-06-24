import { Route } from "react-router-dom";
import {
  HomePage,
  ChatsPage,
  LoginPage,
  RegisterPage,
} from "./components/pages";
import Navbar from "./components/Navbar";

const navRoutes = [
  { id: 1, name: "Contact Us", path: "/contactus" },
  { id: 2, name: "About", path: "/about" },
  { id: 3, name: "Login", path: "/login" },
  { id: 4, name: "Register", path: "/register" },
];

const pageRoutes = [
  { id: 1, path: "/", component: HomePage },
  { id: 2, path: "/chats", component: ChatsPage },
  { id: 3, path: "/login", component: LoginPage },
  { id: 4, path: "/register", component: RegisterPage },
];
export default function App() {
  return (
    <div className="h-screen">
      <Navbar appName="Messenger" routes={navRoutes} />
      <main className="p-7">
        {pageRoutes.map((pageRoute) => (
          <Route
            key={pageRoute.id}
            path={pageRoute.path}
            component={pageRoute.component}
            exact
          />
        ))}
      </main>
    </div>
  );
}
