import React from "react";
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

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, PlusCircle, Trash, Trash2 } from "lucide-react";
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
const ManageAnnouncementsPage = ({userData}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [announcement, setAnnouncement] = useState({
    announcement_title: "",
    announcement_message: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const addAnnouncement = async () => {
    const response = await axios.post(
      `${constants.API_URL}/mess/announcement/new`,
      announcement,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.error) {
      toast.error(response.data.message);
    } else {
      getAnnouncements(currentPage);
      setAnnouncement({
        announcement_title: "",
        announcement_message: "",
      });
    }
  };
  const deleteAnnouncement = async (announcement_id) => {
    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/announcement/delete`,
        { announcement_id: announcement_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      getAnnouncements(currentPage);
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
  const getAnnouncements = async (page) => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/announcements/${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnnouncements(response.data.data.results);
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
    getAnnouncements(currentPage);
  }, []);
  return (
    <>
      <div className='h-full w-[85vw] flex flex-col align-center justify-start '>
        <div className='flex  ml-10 w-[90%] space-y-8  h-fit mt-12 '>
          <span className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
            Manage Announcements
          </span>
        </div>
        <div className='flex  w-[90%] space-y-8  h-fit mt-12'>
          <Dialog>
            <DialogTrigger>
              <Button className='ml-10 bg-green-500'>
                <PlusCircle />
                Make New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Announcement</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col space-y-4'>
                <span>Title</span>
                <Input
                  type='text'
                  placeholder='Announcement Title'
                  onChange={(e) => {
                    setAnnouncement({
                      ...announcement,
                      announcement_title: e.target.value,
                    });
                  }}
                />
                <span>Message</span>
                <Textarea
                  type='text'
                  placeholder='Announcement Message'
                  onChange={(e) => {
                    setAnnouncement({
                      ...announcement,
                      announcement_message: e.target.value,
                    });
                  }}
                />
                <DialogClose>
                  <Button onClick={addAnnouncement}>Submit</Button>
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
        <div className='flex flex-col ml-10  w-[90%] space-y-8  h-fit mt-12'>
          <span className="scroll-m-20 text-2xl font-semibold tracking-tight">Announcements: {announcements.length}</span>
          {announcements.map((item, key) => {
            return (
              <Card key={key} className='w-[500px]'>
                <CardHeader>
                  <CardTitle>{item.announcement_title}</CardTitle>
                  <span className='text-xs text-muted-foreground ' style={{marginBottom:"-20px"}}>
                    Last Update:{" "}
                    {moment(parseInt(item.updated_at)).format("lll")} by{" "}
                    {item.name}
                  </span>
                </CardHeader>
                {
                  userData?? item.user_id===userData.user_id?<CardContent>
                  <span className='block leading-7 mt-0 mb-3'>
                    {item.announcement_message}
                  </span>
                  <Button>
                    {" "}
                    <Pencil /> Edit
                  </Button>
                  <Button
                    onClick={() => deleteAnnouncement(item.announcement_id)}
                    variant='destructive'
                    className='ml-2'
                  > 
                    {" "}
                    <Trash2 />
                    Delete
                  </Button>
                </CardContent>:<span className="pb-5 w-[100%] flex justify-end"></span>
                }
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ManageAnnouncementsPage;
