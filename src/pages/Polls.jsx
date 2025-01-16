import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { checkTokenExpiredError } from "@/lib/functions";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import * as constants from "@/constants.json";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Polls = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [polls,setPolls] = useState([])
  const navigate = useNavigate();
  const getPolls = async () => {
    const resposne = await fetch(`${constants.API_URL}/mess/polls/1`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const parsed = await resposne.json();
    setPolls(parsed.data.results);
  };
  const answerToPoll = async (answer, poll_id) => {
    const response = await fetch(`${constants.API_URL}/mess/poll/${poll_id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ option_no: parseInt(answer) }),
    });
    const parsed = await response.json();
    if (parsed.error) {
      toast({
        title: "Error",
        description: parsed.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: parsed.message,
      });
      getPolls();
    }
  };
  useEffect(() => {
    getPolls(currentPage);
  }, []);
  return (
    <div className="flex  justify-center w-[100%] text-3xs  announcement_page">
      <div
        className="h-full flex flex-col fr align-center justify-start shadow h-[100%]"
        style={{ width: "95%", maxWidth: "900px" ,position:"relative"}}
      >
        <div className="flex  ml-5 w-[90%] space-y-8  h-fit mt-12 ">
          <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Polls
          </span>
        </div>
        
        <div className="flex flex-col ml-5  w-[90%] space-y-8 p-0 mb-5  h-fit mt-0">
          {polls.map((poll,k1) => {
               const totalVotes = poll.results.reduce((a, b) => a + b, 0);
               return (
                 <div key={k1} className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-md w-[100%] h-fit mt-4 shadow" >
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
        </div>
        <div className='flex justify-end w-[100%] flex-col '>
                  <span className='ml-5 text-3xs text-muted-foreground text-center' style={{width:"100%"}}> Page {currentPage} of {totalPages}</span>
                <Pagination className="mt-1 mb-10 ml-4">
                    <PaginationContent>
                      {totalPages &&
                        totalPages > 0 &&
                        Array.from({ length: totalPages }, (_, index) => index + 1).map(
                          (page) => (
                            <PaginationItem
                              style={{cursor:"pointer"}}
                              key={page}
                              onClick={() => getAnnouncements(page)}
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
      </div>
      
    </div>
  );
};

export default Polls;
