import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import * as constants from "@/constants.json";
import * as mealData from "@/lib/mealData";
import { checkTokenExpiredError } from "@/lib/functions";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import moment from "moment";
import { Badge } from "@/components/ui/badge"
const HomePage = () => {
  const { user, login } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [polls,setPolls] = useState([])

  const [nextMealMenu, setNextMealMenu] = useState(null);
  const [nextMealSlot, setNextMealSlot] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [wastages, setWastages] = useState(null);

  /// API CALLS
  // Get polls
  const getPolls = async () =>{
      const resposne = await fetch(`${constants.API_URL}/mess/polls/1`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const parsed = await resposne.json();
      setPolls(parsed.data.results.slice(0,3));
    }

  //   To get next meal menu
  const getNextMealMenu = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/menu/current`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setNextMealMenu(response.data.data.menu);
      setNextMealSlot(mealData.default.slot[response.data.data.menu_slot]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  // to get all announcements
  const getAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/announcements/1`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setAnnouncements(response.data.data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  // Mark attendance
  const markAttendance = async (willEat) => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/attend`,
        {
          is_attending: willEat,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast({
        title: "Success",
        description: response.data.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };
  const answerToPoll = async (answer, poll_id) => {
    const response = await fetch(`${constants.API_URL}/mess/poll/${poll_id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ option_no: parseInt(answer) }),
    })
    const parsed = await response.json()
    if(parsed.error){
      toast({
        title: "Error",
        description: parsed.error,
        variant: "destructive",
      });
    }else{
      toast({
        title: "Success",
        description: parsed.message,
      });
      getPolls();
    }
  }
  // Fetch wastages from yesterday's date and for 7 days
  const fetchWastages = async () => {
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

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
      setWastages(totalWastage);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    getNextMealMenu();
    getAnnouncements();
    fetchWastages();
    getPolls()
  }, []);

  return (
    <>
      {/* For laptops/desktops */}
      <div className="flex flex-col home_page  space-y-4 lg:flex-row lg:justify-center lg:space-x-8">
        <div className="lg:w-1/3 space-y-8 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Are you going to eat upcoming/ongoing {nextMealSlot}?
              </CardTitle>
              <CardDescription>
                This helps us reduce food wastage, please fill ASAP and only if
                confirm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-x-4">
              <Button variant="outline" onClick={() => markAttendance(true)}>
                Yes
              </Button>
              <Button
                variant="destructive"
                onClick={() => markAttendance(false)}
              >
                No
              </Button>
            </CardContent>
          </Card>
          {announcements && announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Latest Announcements 📢</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <Alert key={announcement.announcement_id}>
                    <AlertTitle className="font-semibold">
                      <span>{announcement.announcement_title}</span>
                    </AlertTitle>
                    <AlertDescription>
                      <span className="block my-2 text-xs text-muted-foreground">
                        Last Update:{" "}
                        {moment(parseInt(announcement.updated_at)).format(
                          "lll",
                        )}{" "}
                        by {announcement.name}{" "}
                      </span>
                      {announcement.announcement_message}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          

          <Card>
            <CardHeader>
              <CardTitle>Latest Polls</CardTitle>
            </CardHeader>
            <CardContent>
            {polls.map((poll,k1) => {
               const totalVotes = poll.results.reduce((a, b) => a + b, 0);
               return (
                 <div key={k1} className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-md w-[100%] h-fit mt-4 mr-4">
                   {poll.is_closed?<Badge className="w-fit" variant="destructive">Ended</Badge>:<Badge className="w-fit">Ongoing</Badge>}
                   <span className="text-sm text-gray-500">Created at {moment(parseInt(poll.created_at)).format("lll")} by {poll.name}</span>
                   <span className="font-semibold">{poll.poll_title}</span>
                   {poll.poll_options.map((option,k2) => {
                     return (
                       <div onClick={()=>{if (!poll.is_closed){answerToPoll(k2+1,poll.poll_id)}}} key={k2} className="flex justify-between  border border-gray-300 rounded-md py-1 px-5" style={{position:"relative",cursor:"pointer",borderColor:(poll.your_answer===(k2+1)?"red":"lightgray")}}>
                         <span style={{zIndex:2}}>{option}</span>
                         <span style={{width:(totalVotes!=0?poll.results[k2]*100/totalVotes:0)+"%",backgroundColor:"lightgray",position:"absolute",top:0,left:"0",height:"100%",zIndex:1}} className="rounded-md"></span>
                         <span style={{zIndex:2}} className="font-semibold ">{Math.floor(totalVotes!=0?poll.results[k2]*100/totalVotes:0)}%</span>
                       </div>
                     );
                   })}
                   <span className="font-semibold">Total Votes: {totalVotes}</span>
                 </div>
             )})}
            </CardContent>
          </Card>
        </div>
        <Separator orientation="vertical" />
        <div>
        <Card>
            <CardHeader>
              <CardTitle>What's there in the ongoing/upcoming meal?</CardTitle>
              <CardDescription>{nextMealSlot}</CardDescription>
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
                  {nextMealMenu &&
                    nextMealMenu.map((menuItem) => (
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
        <div>
          <Card className="h-full mt-5" style={{border:"1px solid red"}}>
            <CardContent className="p-10 ">
            <div className="flex  justify-start items-center mb-5">
                <span className="text-[1.2rem]">
                  Day before's yesterday wastage : &nbsp;
                </span>
                <span className="text-[1.5rem] font-semibold" style={{color:"red"}}>
                  {wastages}
                </span>
                <span className="text-[1.5rem]" >kg</span>
              </div>
              <Separator className="bg-red-200" />
              <div className="flex  justify-start items-center mt-5">
                <span className="text-[1.2rem]">
                  Enough to feed approximately : &nbsp;
                </span>
                <span className="text-[1.5rem] font-semibold" style={{color:"red"}}>
                  {wastages * 5}
                </span>
                <span className="text-[1.5rem]" >people</span>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;