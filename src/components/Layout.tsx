import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Layout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const isConfirm = confirm("Are you sure you want to logout?");
    if (isConfirm) {
      await auth.signOut();
      navigate("/login");
    }
  };
  return (
    <Wrapper>
      <Menu>
        <Link to="/">
          <MenuItem>Home</MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>profile</MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>logout</MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100%;
  max-width: 780px;
  height: 100%;
  margin: 0 auto;
  padding: 50px 0;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  align-items: center;
`;

const Menu = styled.div``;

const MenuItem = styled.div``;
