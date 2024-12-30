import { toast, useToast } from "@/hooks/use-toast";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import * as constants from "@/constants.json";
import { checkTokenExpiredError } from "@/lib/functions";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ManageUsersPage = () => {
  const [usersList, setUsersList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  /// API Calls

  // get users data by pagination
  const getUsers = async (page) => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/user/find/${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsersList(response.data.data.results);
      setTotalPages(
        Math.ceil(
          response.data.data.total_pages
        )
      );
      setCurrentPage(response.data.data.page_no);
    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        navigate("/auth");
        localStorage.removeItem("token");
        toast({
          description: error.response.data.message + " Please login again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    getUsers(currentPage);
  }, []);

  return (
    <div className="h-full w-[85vw] ml-10 flex flex-col align-center justify-start">
      <div className='flex   w-[90%] space-y-8  h-fit mt-12 '>
          <span className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Manage Users
          </span>
        </div>
      <span>Showing page {currentPage} of {totalPages}</span>
      <Pagination>
        <PaginationContent>
          {totalPages &&
            currentPage &&
            Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem key={page} onClick={() => getUsers(page)}>
                  <PaginationLink isActive={page === currentPage}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
        </PaginationContent>
      </Pagination>
      <hr/>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersList.map((u) => {
            if (u.email !== user.email) {
              return (
                <TableRow>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.is_admin ? (
                      <RemoveFromAdminButton userId={u.user_id} setUsersList={setUsersList} />
                    ) : (
                      <MakeAdminButton userId={u.user_id} setUsersList={setUsersList} />
                    )}
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageUsersPage;

const RemoveFromAdminButton = ({ userId, setUsersList }) => {
  const removeFromAdmin = async () => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/user/${userId}/role/change`,
        {
          user_role: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsersList(users => users.map(u => {
        if (u.user_id === userId) {
          u.is_admin = false;
        }
        return u;
      }))
      toast({
        title: "Success",
        description: response.data.message,
      });

    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        navigate("/auth");
        localStorage.removeItem("token");
        toast({
          description: error.response.data.message + " Please login again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button variant='destructive' onClick={removeFromAdmin}>
      Remove from admin
    </Button>
  );
};

const MakeAdminButton = ({ userId, setUsersList }) => {
  const makeAdmin = async () => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/user/${userId}/role/change`,
        {
          user_role: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsersList(users => users.map(u => {
        if (u.user_id === userId) {
          u.is_admin = true;
        }
        return u;
      }))
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        navigate("/auth");
        localStorage.removeItem("token");
        toast({
          description: error.response.data.message + " Please login again.",
        });
      } else {
        toast({
          title: "Error",
          description: error.response.data.message,
          variant: "destructive",
        });
      }
    }
  };
  return <Button onClick={makeAdmin}>Make admin</Button>;
};
