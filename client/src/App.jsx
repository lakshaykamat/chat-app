import { Route } from "react-router-dom";
import {
  HomePage,
  ChatsPage,
  LoginPage,
  ContactUsPage,
  AboutPage,
} from "./components/pages";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";

const navRoutes = [
  { id: 1, name: "Contact Us", path: "/contactus" },
  { id: 2, name: "About", path: "/about" },
  { id: 3, name: "Login", path: "/login" },
];

const pageRoutes = [
  { id: 2, path: "/chats", component: ChatsPage },
  { id: 3, path: "/login", component: LoginPage },
  { id: 5, path: "/contactus", component: ContactUsPage },
  { id: 6, path: "/about", component: AboutPage },
];
export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
          <ProtectedRoute path="/" component={HomePage} />
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
