import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import * as constants from "@/constants.json";
import { checkTokenExpiredError } from "@/lib/functions";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const GiveSuggestionPage = () => {
  const [newItem, setNewItem] = useState("");
  const [oldItem, setOldItem] = useState();
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menu, setMenu] = useState([]);
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
          meals.push({value:j.menu_id,label:j.meal_item})}}
      setMenu(meals);
    };
    fetchMenu();
  },[])
  const handleSubmit = async () => {
    if (!newItem) {
      toast({
        title: "Error",
        description: "Please enter a new item",
        variant: "destructive",
      });
      return;
    }
    try {
      if (oldItem) {
        const response = await axios.post(
          `${constants.API_URL}/mess/suggestion`,
          {
            changes_new_item: newItem,
            changes_old_item: parseInt(oldItem),
            reason: reason,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast({
          title: "Success",
          description: response.data.message,
        });
        setNewItem("");
        setOldItem();
        setReason("");
        return;
      }
      const response = await axios.post(
        `${constants.API_URL}/mess/suggestion`,
        {
          changes_new_item: newItem,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast({
        title: "Success",
        description: response.data.message,
      });
      setNewItem("");
      setOldItem(null);
      setReason("");
      navigate("/");
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
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className='flex justify-center announcement_page min-h-screen'>
     
    <Card className="max-w-[600px] w-[90vw] h-fit">
      <CardHeader>
        <CardTitle className="text-2xl">Give Suggestion</CardTitle>
        <CardDescription>Your suggestion makes a difference.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label >New Item</Label>
              <Input placeholder="New Item" value={newItem} onChange={(e) => setNewItem(e.target.value)}></Input>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label >Replace with/ If you want</Label>
              <Popover open={open} className="w-[100%]" onOpenChange={setOpen}>
                <PopoverTrigger asChild className="w-[100%]">
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[100%] justify-between"
                  >
                    {value
                      ? menu.find((framework) => framework.value === oldItem)?.label
                      : "Search Meal"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[100%] p-0">
                  <Command className="w-[100%]">
                    <CommandInput className="w-[100%]" placeholder="Search Meal" />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {menu.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            className="w-[100%]"
                            onSelect={() => {
                              setOldItem(framework.value)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === framework.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="mb-3">
                Reason
              </Label>
              <Textarea
                    type="text"
                    placeholder="Your reason here"
                    className="mt-3"
                    onChange={(e) => {
                      setReason(e.target.value)
                    }}
                  />
            </div>
       
      
            </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" className="mr-5">Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </CardFooter>
    </Card>
    </div>
  );
};

export default GiveSuggestionPage;
