import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../firebase";
import HomeSvg from "../svgs/HomeSvg";
import UserSvg from "../svgs/UserSvg";
import ExitSvg from "../svgs/ExitSvg";

const MainLayout = () => {
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
          <MenuItem>
            <HomeSvg />
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>
            <UserSvg />
          </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>
          <ExitSvg color="#fe7a7b" />
        </MenuItem>
      </Menu>
      <Outlet />
    </Wrapper>
  );
};

export default MainLayout;

const Wrapper = styled.div`
  width: 100%;
  max-width: 780px;
  height: 100%;
  margin: 0 auto;
  padding: 50px 0;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
`;

const Menu = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
`;

const MenuItem = styled.div`
  width: 48px;
  cursor: pointer;
`;
