import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import SignupPage from "./routes/SignupPage";
import RouteUserOnly from "./components/common/RouteUserOnly";
import LoginPage from "./routes/LoginPage";
import HomePage from "./routes/HomePage";
import ProfilePage from "./routes/ProfilePage";
import MainLayout from "./components/layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RouteUserOnly>
        <MainLayout />
      </RouteUserOnly>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #000;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

  }
  input, textarea, button {
    background-color: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    color: inherit;
    font-size: inherit;
  }
  textarea {
    resize: none;
  }
`;

function App() {
  const [loaded, setLoaded] = useState(false);
  const init = async () => {
    // wait for firebase to auth user
    await auth.authStateReady();
    setLoaded(true);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {!loaded ? <div>loading</div> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
