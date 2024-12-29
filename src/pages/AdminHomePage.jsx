import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import * as constants from "@/constants.json";
import { checkTokenExpiredError } from "@/lib/functions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as mealData from "@/lib/mealData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminHomePage = () => {
  const [currentMenu, setCurrentMenu] = useState(null);
  const [attendance, setAttendance] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  /// API Calls

  const getCurrentMenu = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/menu/current`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCurrentMenu(response.data.data.menu);
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

  const getAttendance = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/attendance/next`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAttendance(response.data.data.total_attendance);
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
    getCurrentMenu();
    getAttendance();
  }, []);

  return (
    <div className='h-full w-[85vw] flex justify-center items-start '>
      <div className='flex flex-col justify-center w-[90%] space-y-8  h-fit mt-12'>
        <span className='mt-10 scroll-m-20 border-b pb-2 text-4xl font-semibold tracking-tight transition-colors first:mt-0'>
          Home Page
        </span>
        <div className="flex">
          <div className='w-1/2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-xl'>
                  Next/Current Meal Menu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Type</TableHead>
                      <TableHead>Item</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMenu &&
                      currentMenu.map((menuItem) => (
                        <TableRow key={menuItem.menu_id}>
                          <TableCell>
                            {mealData.default.type[menuItem.meal_type]}
                          </TableCell>
                          <TableCell>{menuItem.meal_item}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <div className='flex flex-col items-center'>
                <span className='text-[8rem]'>{attendance}</span>
                <span className='text-2xl'>People will eat next meal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
