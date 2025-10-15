import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "",
    experience: "",
    position: 0,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

useEffect(() => {
  const fetchJob = async () => {
    console.log("🔍 Fetching job from:", `${JOB_API_ENDPOINT}/${id}`);
    try {
      const res = await axios.get(`${JOB_API_ENDPOINT}/${id}`, {
        withCredentials: true,
      });
      console.log("✅ Job fetch response:", res);

      if (res.data.status) {
        const job = res.data.job;
        setInput({
          title: job.title,
          description: job.description,
          requirements: job.requirements.join(", "),
          salary: job.salary,
          jobType: job.jobType,
          experience: job.experienceLevel,
          position: job.position,
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("❌ Fetch Job Error:", error);
      toast.error("Failed to fetch job details");
    } finally {
      setFetching(false);
    }
  };

  fetchJob();
}, [id]);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        `${JOB_API_ENDPOINT}/job/${id}`,
        {
          ...input,
          requirements: input.requirements.split(",").map((r) => r.trim()), // convert back to array
        },
        { withCredentials: true }
      );

      if (res.data.status) {
        toast.success("Job updated successfully!");
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-screen my-5">
      <form
        onSubmit={submitHandler}
        className="p-8 max-w-4xl border border-gray-500 shadow-sm hover:shadow-xl hover:shadow-red-300 rounded-lg"
      >
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={input.title}
              placeholder="Enter job title"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={input.description}
              placeholder="Enter job description"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Salary</Label>
            <Input
              type="number"
              name="salary"
              value={input.salary}
              placeholder="Enter job salary"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Position</Label>
            <Input
              type="number"
              name="position"
              value={input.position}
              placeholder="Enter job position"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Requirements</Label>
            <Input
              type="text"
              name="requirements"
              value={input.requirements}
              placeholder="Comma-separated requirements"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Experience</Label>
            <Input
              type="number"
              name="experience"
              value={input.experience}
              placeholder="Enter job experience"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>

          <div>
            <Label>Job Type</Label>
            <Input
              type="text"
              name="jobType"
              value={input.jobType}
              placeholder="Enter job type"
              onChange={changeHandler}
              className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 hover:shadow-blue-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-center mt-5">
          {loading ? (
            <Button className="w-full px-4 py-2 text-sm text-white bg-black rounded-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-blue-600"
            >
              Update Job
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditJob;
