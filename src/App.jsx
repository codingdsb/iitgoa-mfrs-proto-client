import AuthPage from "./pages/AuthPage";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "./components/ui/toaster";
import { useStore } from "./store";
import Navbar from "./components/blocks/Navbar";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { checkTokenExpiredError } from "./lib/functions";
import { toast } from "./hooks/use-toast";
import * as constants from "@/constants.json";
import FullMenuPage from "./pages/FullMenuPage";
import GiveSuggestionPage from "./pages/GiveSuggestionPage";
import FeedbackPage from "./pages/FeedbackPage";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AdminHomePage from "./pages/AdminHomePage";
import AdminSidebar from "./components/blocks/AdminSidebar";
import ManageUsersPage from "./pages/ManageUsersPage";
import ManageAnnouncementsPage from "./pages/ManageAnnouncementsPage";
import AdminFeedBackPage from "./pages/AdminFeedBackPage";
import AdminSuggestionsPage from "./pages/AdminSuggestionsPage";
import WastageStatistics from "./pages/WastageStatistics";
import AdminPollsPage from "./pages/AdminPollsPage";
import Announcements from "./pages/Announcements";
import Polls from "./pages/Polls";
import "./custom.css"
const App = () => {
  const { user, login } = useStore();
  const [userData,setUserData] = useState()
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${constants.API_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          login({
            name: response.data.data.name,
            user_id:response.data.data.user_id,
            email: response.data.data.email,
            isAdmin: response.data.data.is_admin,
            isSuperAdmin: response.data.data.is_super_admin,
          });
          setUserData(response.data.data)
          toast({
            description: "Welcome " + response.data.data.name,
          });
        } catch (error) {
          navigate("/auth");
          localStorage.removeItem("token");
          if (checkTokenExpiredError(error.response.data.message)) {
            toast({
              description: error.response.data.message + " Please login again.",
            });
          } else {
            toast({
              title: "Error",
              description: error.response.data.message + " Please login again.",
              variant: "destructive",
            });
          }
        }
      } else {
        navigate("/auth");
      }
    };
    checkToken();
  }, []);
  return (
    <>
      <Toaster />

      <Routes>
        <Route element={<RegularLayout />}>
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/full-menu' element={<FullMenuPage />} />
          <Route path='/suggest' element={<GiveSuggestionPage />} />
          <Route path='/feedback' element={<FeedbackPage />} />
          <Route path='/announcements' element={<Announcements />} />
          <Route path='/polls' element={<Polls />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path='/admin/home' element={<AdminHomePage />} />
          <Route path='/admin/manage-users' element={<ManageUsersPage />} />
          <Route
            path='/admin/announcements'
            element={<ManageAnnouncementsPage userData={userData}/>}
          />
          <Route
            path='/admin/feedbacks'
            element={<AdminFeedBackPage />}
          />
          <Route path='/admin/suggestions' element={<AdminSuggestionsPage />} />
          <Route path='/admin/wastage' element={<WastageStatistics />} />
          <Route path='/admin/polls' element={<AdminPollsPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

const RegularLayout = () => {
  const { user } = useStore();
  return (
    <>
      {user && <Navbar />}
      <Outlet />
    </>
  );
};

const AdminLayout = () => (
  <SidebarProvider style={{width:"100vw",overflow:"hidden"}}>
    <AdminSidebar />
    <main>
      
      <SidebarTrigger className='lg:hidden' />
      <Outlet />
    </main>
  </SidebarProvider>
);
