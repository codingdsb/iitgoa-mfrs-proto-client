import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteIcon, PlusCircle, Trash, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as constants from "@/constants.json";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import moment from "moment";

const AdminPollsPage = () => {
  const [poll_title, setPollTitle] = React.useState("");
  const [poll_options, setPollOptions] = React.useState([""]);
  const [totalPages, setTotalPages] = useState(1);
  const [polls,setPolls] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const createPoll = async () => {
    const resposne = await fetch(`${constants.API_URL}/mess/poll/new`, {
      method: "POST",
      body: JSON.stringify({
        poll_title: poll_title,
        poll_options: poll_options,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const parsed = await resposne.json();
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
  const endPolling = async ({poll_id}) =>{
    const resposne = await fetch(`${constants.API_URL}/mess/poll/${poll_id}/close`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const parsed = await resposne.json();
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
  }
  const getPolls = async () =>{
    const resposne = await fetch(`${constants.API_URL}/mess/polls/${currentPage}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const parsed = await resposne.json();
    setTotalPages(parsed.data.total_pages);
    setCurrentPage(parsed.data.page_no);
    setPolls(parsed.data.results);
  }
  useEffect(()=>{
    getPolls()
  },[])
  return (
    <>
      <div className="h-full w-[85vw] flex flex-col align-center justify-start ">
        <div className="flex  ml-10 w-[90%] space-y-8  h-fit mt-12 ">
          <span className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Polls
          </span>
        </div>
        <div className=" w-[100%]">
          <Dialog>
            <DialogTrigger>
              <Button className="ml-10 bg-green-500 mt-10">
                <PlusCircle />
                Create New Poll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Poll</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <span>Poll Title</span>
                <Input
                  type="text"
                  placeholder="Poll Title"
                  value={poll_title}
                  onChange={(e) => {
                    setPollTitle(e.target.value);
                  }}
                />
                <span>Options</span>
                {poll_options.map((option, index) => {
                  return (
                    <div key={index} className="flex space-x-4">
                      <Input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          let new_poll_options = [...poll_options];
                          new_poll_options[index] = e.target.value;
                          setPollOptions(new_poll_options);
                        }}
                      />
                      <Button
                        onClick={() =>
                          setPollOptions((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  );
                })}
                <Button
                  className="w-[120px]"
                  variant="outline"
                  onClick={() => setPollOptions([...poll_options, ""])}
                >
                  <PlusCircle />
                  Add Option
                </Button>
                <DialogClose>
                  <Button onClick={createPoll}>Submit</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <Pagination>
            <PaginationContent>
              {totalPages &&
                totalPages > 0 &&
                Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => (page)}
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
        <div className="w-[100%] flex flex-wrap ml-10">
          {polls.map((poll,k1) => {
            const totalVotes = poll.results.reduce((a, b) => a + b, 0);
            return (
              <div key={k1} className="flex flex-col space-y-4 p-4 border border-gray-300 rounded-md w-[500px] h-fit mt-4 mr-4">
                <span className="text-sm text-gray-500">Created at {moment(parseInt(poll.created_at)).format("lll")} by {poll.name}</span>
                <span className="font-semibold">{poll.poll_title}</span>
                {poll.poll_options.map((option,k2) => {
                  return (
                    <div key={k2} className="flex justify-between  border border-gray-300 rounded-md py-1 px-5" style={{position:"relative"}}>
                      <span>{option}</span>
                      <span style={{width:(totalVotes!=0?poll.results[k2]*100/totalVotes:0)+"%",backgroundColor:"lightgray",position:"absolute",top:0,left:"0",height:"100%",zIndex:-1}} className="rounded-md">{}</span>
                      <span className="font-semibold ">{Math.floor(totalVotes!=0?poll.results[k2]*100/totalVotes:0)}%</span>
                    </div>
                  );
                })}
                <span className="font-semibold">Total Votes: {totalVotes}</span>
                {!poll.is_closed?<Button variant="destructive" onClick={() => endPolling({poll_id:poll.poll_id})}>End Polling</Button>:<Button disabled variant="outline">Polling Ended</Button>}
              </div>
          )})}
        </div>
      </div>
    </>
  );
};

export default AdminPollsPage;
