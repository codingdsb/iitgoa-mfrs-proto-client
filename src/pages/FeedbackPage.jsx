import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";
import * as constants from "@/constants.json";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiredError } from "@/lib/functions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

const FeedbackPage = () => {
  const [slot, setSlot] = useState(0);
  const [rating, setRating] = useState(0);
  const [questions, setQuestions] = useState([
    "How was the taste of the food?",
    "Comment on the hygiene of the mess?",
    "Did you like the variety of the food?",
  ]);
  const [answers, setAnswers] = useState(["", "", ""]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!slot) {
      toast({
        title: "Error",
        description: "Please select a slot",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${constants.API_URL}/mess/feedback`,
        {
          meal_slot: parseInt(slot),
          rating: parseInt(rating),
          questions: questions,
          answers: answers,
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
      navigate("/");
    } catch (error) {
      if (checkTokenExpiredError(error.response.data.message)) {
        localStorage.removeItem("token");
        navigate("/auth");
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
  return (
    <div className="flex justify-center announcement_page min-h-screen ">
      <Card className="max-w-[600px] w-[90vw] h-fit">
        <CardHeader>
          <CardTitle className="text-2xl">Add your Feedback</CardTitle>
          <CardDescription>Give you feedback on today's meal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label>Select the Slot</Label>
                <Select onValueChange={setSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Breakfast</SelectItem>
                    <SelectItem value="2">Lunch</SelectItem>
                    <SelectItem value="3">Snacks</SelectItem>
                    <SelectItem value="4">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Rate the Food</Label>
                <div className="flex space-x-4 justify-start items-center text-3xl">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      rating == 1 ? setRating(0) : setRating(1);
                    }}
                  >
                    {rating > 0 ? "★" : "☆"}
                  </div>
                  <div className="cursor-pointer" onClick={() => setRating(2)}>
                    {rating > 1 ? "★" : "☆"}
                  </div>
                  <div className="cursor-pointer" onClick={() => setRating(3)}>
                    {rating > 2 ? "★" : "☆"}
                  </div>
                  <div className="cursor-pointer" onClick={() => setRating(4)}>
                    {rating > 3 ? "★" : "☆"}
                  </div>
                  <div className="cursor-pointer" onClick={() => setRating(5)}>
                    {rating > 4 ? "★" : "☆"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="mb-3">
                  Add your feedback
                </Label>
                {questions.map((question, index) => (
                  <div className="border rounded-md p-4">
                    <span>
                      {index + 1}) {question}
                    </span>
                    <Textarea
                      type="text"
                      placeholder="Your answer here"
                      className="mt-3"
                      onChange={(e) => {
                        setAnswers((prev) => {
                          const newAnswers = [...prev];
                          newAnswers[index] = e.target.value;
                          return newAnswers;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-5">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeedbackPage;
