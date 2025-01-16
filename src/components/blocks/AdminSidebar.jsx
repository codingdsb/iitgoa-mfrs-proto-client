import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useStore } from "@/store";
import {
  Home,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Megaphone,
  Plus,
  Star,
  Trash2,
  User,
  Vote,
} from "lucide-react";
import { useEffect } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const logoutUser = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/auth");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <img src='/logo-full.png' />
        <br />
        <span className='font-bold text-2xl text-center'>Admin Panel</span>
      </SidebarHeader>
      <br />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/admin/home")}>
                  <LockKeyhole />
                  Administration Home Page
                </SidebarMenuButton>
              </SidebarMenuItem>
              {user && user.isSuperAdmin ? (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => navigate("/admin/manage-users")}
                  >
                    <User />
                    Manage Users
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/admin/announcements")}
                >
                  <Megaphone />
                  Manage Announcements
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/admin/wastage")}>
                  <Trash2 />
                  Wastage
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/admin/suggestions")}>
                  <Lightbulb />
                  Suggestions
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/admin/feedbacks")}>
                  <Star />
                  Feedbacks
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/admin/polls")}>
                  <Vote />
                  Polls
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className='text-blue-500'
                  onClick={() => navigate("/")}
                >
                  <Home />
                  Back To Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className='text-red-500'
                  onClick={logoutUser}
                >
                  <LogOut />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
