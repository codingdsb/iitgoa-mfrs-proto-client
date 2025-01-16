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
  const [wastages, setwastages] = useState(0);
  const [avg, setavg] = useState(0);
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
  const getFeedbacks = async (page) => {
    try {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      const response = await axios.post(
        `${constants.API_URL}/mess/feedbacks/1`,
        {
            meal_date:date.getTime()
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const avgs = response.data.data.results.reduce((acc, curr) => acc + curr.rating, 0) / response.data.data.results.length;
      setavg(avgs);
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
  const fetchWastages = async () => {
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/wastages/1`,
        {
          start_date: dayBeforeYesterday,
          end_date: dayBeforeYesterday,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      // add up the wastages
      let totalWastage = 0;
      for (let i = 0; i < response.data.data.results.length; i++) {
        totalWastage += response.data.data.results[i].wastage;
      }
      setwastages(totalWastage);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    getCurrentMenu();
    getAttendance();
    fetchWastages()
    getFeedbacks()
  }, []);
  return (
    <div className='h-full w-[85vw] flex flex-col align-center justify-start ml-10 admin_page'>
      <div className='flex flex-col justify-center w-[90%] space-y-8  h-fit '>
      <div className='flex  space-y-8  h-fit mt-12 '>
          <span className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Admin Home
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row mb-10">
            <Card className="h-[100px] p-0 flex items-center border-red-500 text-red-500 mr-5">
              <CardContent>
                <div className='flex flex-col h-[100px] mt-[30px] w-[100%] items-center'>
                  <span className='text-[2rem] mr-5'>{attendance}</span>
                  <span className='text-xl'>People will eat next meal</span>
                </div>
              </CardContent>
            </Card>
            <Card className="h-[100px] p-0 flex  items-center mr-5 border-red-500 text-red-500">
              <CardContent>
                <div className='flex h-[100px] flex-col mt-[30px] w-[100%] items-center'>
                  <span className='text-[2rem] mr-5'>{avg?avg:0}☆</span>
                  <span className='text-xl'>Yesterday's Average ratings</span>
                </div>
              </CardContent>
            </Card>
            <Card className="h-[100px] p-0 flex items-center  border-red-500 text-red-500">
              <CardContent>
                <div className='flex h-[100px] flex-col mt-[30px] w-[100%] items-center'>
                  <span className='text-[2rem] mr-5'>{wastages}kg</span>
                  <span className='text-xl'>Food Wastage Yesterday</span>
                </div>
              </CardContent>
            </Card>
            </div>
          <div className='w-1/2'>
            <Card className="mr-5">
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
         
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
