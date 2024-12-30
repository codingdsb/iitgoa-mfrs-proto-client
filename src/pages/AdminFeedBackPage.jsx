import React from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import * as constants from "@/constants.json";
import { checkTokenExpiredError } from "@/lib/functions";
import axios from "axios";
import { useEffect, useState } from "react";
import mealData from "@/lib/mealData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon, Pencil, PlusCircle, Trash, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
const AdminFeedBackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [date,setDate] = useState(new Date());
  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const getFeedbacks = async (page) => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/feedbacks/${page}`,
        {
            meal_date:date
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFeedbacks(response.data.data.results);
      setTotalPages(Math.ceil(response.data.data.total_pages));
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
    getFeedbacks(currentPage);
  }, []);
  return (
    <>
      <div className='h-full w-[85vw] flex flex-col align-center justify-start '>
        <div className='flex  ml-10 w-[90%] space-y-8  h-fit mt-12 '>
          <span className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Get Feedbacks
          </span>
        </div>
        <div className='flex flex-col ml-10  w-[90%] space-y-8  h-fit mt-12'>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight" style={{marginBottom:"-15px"}}>
            Select the feedback's date
            </h4>
            <Popover >
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select meal date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
            </Popover>
            <Button className="w-[150px] " style={{marginTop:"15px"}} onClick={() => getFeedbacks(1)} variant="default">Get Feedbacks</Button>
          <Pagination>
            <PaginationContent>
              {totalPages &&
                totalPages > 0 &&
                Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => getFeedbacks(page)}
                    >
                      <PaginationLink isActive={page === currentPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}  
            </PaginationContent>
          </Pagination>
        </div>
          <span className="ml-10">Feedbacks : {feedbacks.length}</span>
        <div className='flex ml-10  w-[90%]  h-fit mt-12' style={{flexWrap:"wrap"}}>
          {[...feedbacks,...feedbacks,...feedbacks,...feedbacks,...feedbacks].map((item, key) => {
            return (
              <Card key={key} className='w-[300px] h-fit mr-2 mb-2'>
                <CardHeader>
                  <span className='text-xs text-muted-foreground '>
                    Last Update:{" "}
                    {moment(parseInt(item.updated_at)).format("lll")} by{" "}
                    {item.name}
                  </span>
                  <span className='text-xs '>
                    Meal Slot: {mealData['slot'][item.meal_slot]}
                  </span>
                  <span className='text-xm text-muted-foreground ' style={{color:"yellowgreen"}}>
                    {item.rating} Stars
                  </span>
                  <div>
                    {item.questions.map((question, key) => {
                        return <div className="flex flex-col" key={key}><span className='text-xs ' >
                        {key+1}) {question}
                      </span>
                      
                      <span className='text-xs text-muted-foreground ' >
                        Ans: {item.answers[key]}
                    </span>
                      </div>
                    })}
                  </div>
                </CardHeader>
           
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminFeedBackPage;
