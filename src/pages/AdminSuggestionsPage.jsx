import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as constants from "@/constants.json";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { checkTokenExpiredError } from "@/lib/functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSuggestionsPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menu, setMenu] = useState([]);
  /// API Calls
  useEffect(()=>{
    const fetchMenu = async () => {
      const response = await axios.get(`${constants.API_URL}/mess/menu/full`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data =await response.data.data.map((item)=>{return item.menu});
      let meals = []
      for(let i of data){
        for (let j of i){
          meals.push({id:j.menu_id,name:j.meal_item})}}
      setMenu(meals);
    };
    fetchMenu();
  },[])
  // get suggestions data by pagination
  const getSuggestions = async (page) => {
    try {
      const response = await axios.get(
        `${constants.API_URL}/mess/suggestions/${page}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setSuggestions(response.data.data.results);
      setTotalPages(response.data.data.total_pages);
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
    getSuggestions(currentPage);
  }, []);

  return (
    <>
      <div className="h-full w-[85vw] flex flex-col align-center justify-start">
        <div className="flex  ml-10 w-[90%] space-y-8  h-fit mt-12 ">
          <span className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Suggestions
          </span>
        </div>
        <br />
        <div className="flex flex-col h-full w-full">
          <span className="ml-10">
            Showing page {currentPage} of {totalPages}
            <br />
            {suggestions.length}
          </span>
          <Pagination>
            <PaginationContent>
              {totalPages &&
                currentPage &&
                Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => getSuggestions(page)}
                    >
                      <PaginationLink isActive={page === currentPage}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
            </PaginationContent>
          </Pagination>
                <div className="flex flex-warp w-[95%]">
          {suggestions &&
            suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="w-[400px] ml-10 mt-4 mb-2">
                <CardHeader>
                  <CardTitle>Suggestion #{suggestion.suggestion_id}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <span className="text-sm font-medium leading-none">
                    <span className="font-bold">Item To Add:</span>{" "}
                    {suggestion.changes_new_item}
                  </span>
                  {suggestion.changes_old_item?<span className="text-sm font-medium leading-none">
                    <span className="font-bold">Item To Remove:</span>{" "}
                    {menu.length>0 ?(menu.filter((item) => item.id == suggestion.changes_old_item))[0]?.name:""}
                  </span>:""}
                  {
                    suggestion.reason?<span className="text-sm font-medium leading-none">
                    <span className="font-bold">Reason:</span>{" "}
                    {suggestion.reason}
                  </span>:""
                  }
                </CardContent>
              </Card>
            ))}
            </div>
        </div>
      </div>
    </>
  );
};

export default AdminSuggestionsPage;