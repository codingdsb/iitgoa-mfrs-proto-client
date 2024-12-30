import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { checkTokenExpiredError } from '@/lib/functions';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { toast, useToast } from "@/hooks/use-toast";
import * as constants from "@/constants.json";

import { useNavigate } from 'react-router-dom';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
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
    getAnnouncements(currentPage)
  }, []);
  return (
    <div className='flex  justify-center w-[100%] announcement_page'>
      <div className='h-full fr flex flex-col align-center justify-start shadow h-[100%]' style={{width:"95%",maxWidth:"900px","position":"relative"}}>
        <div className='flex  ml-5 w-[90%] space-y-8  h-fit mt-12 '>
          <span className='scroll-m-20  pb-3 text-2xl font-semibold tracking-tight first:mt-0'>
            Announcements
          </span>
        </div>

        <div className='flex flex-col ml-5  w-[100%] space-y-8 mb-6  h-fit'>
          {announcements.map((item, key) => {
            return (
              <Card key={key} className='w-[90%]'>
                <CardHeader>
                  <CardTitle className='text-xl'>{item.announcement_title}</CardTitle>
                  <span className='text-3xs text-muted-foreground ' style={{marginBottom:"-20px"}}>
                    Last Updated:{" "}
                    {moment(parseInt(item.updated_at)).format("lll")} by{" "}
                    {item.name}
                  </span>
                </CardHeader>
                <CardContent className="text-4xs">
                    {item.announcement_message}
                </CardContent>
              </Card>
            );
          })}
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
  )
}

export default Announcements