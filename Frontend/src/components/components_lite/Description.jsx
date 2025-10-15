import  { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setSingleJob } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";

const Description = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.status) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (app) => app.applicant === user?._id
            )
          );
        } else {
          setError("Failed to fetch job details.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "An error occurred while fetching job.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, dispatch, user?._id]);

  // Apply to job
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_ENDPOINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);

        const updatedJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };

        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to apply for job");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!singleJob) return <div>No job found</div>;

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob.title}</h1>
          <div className="flex gap-2 items-center mt-4">
            <Badge className="text-blue-600 font-bold" variant="ghost">
              {singleJob.position} Open Positions
            </Badge>
            <Badge className="text-[#FA4F09] font-bold" variant="ghost">
              {singleJob.salary} LPA
            </Badge>
            <Badge className="text-[#6B3AC2] font-bold" variant="ghost">
              {singleJob.location}
            </Badge>
            <Badge className="text-black font-bold" variant="ghost">
              {singleJob.jobType}
            </Badge>
          </div>
        </div>
        <div>
          <Button
  onClick={!singleJob.stopped && !isApplied ? applyJobHandler : null}
  disabled={isApplied || singleJob.stopped}
  className={`rounded-lg ${
    isApplied || singleJob.stopped
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-[#6B3AC2] hover:bg-[#552d9b]"
  }`}
>
  {singleJob.stopped ? "Time Over" : isApplied ? "Already Applied" : "Apply"}
</Button>
        </div>
      </div>

      <h1 className="border-b-2 border-b-gray-400 font-medium py-4">
        {singleJob.description}
      </h1>

      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.position} Open Positions
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob.salary} LPA</span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob.experienceLevel} Year</span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Job Type:{" "}
          <span className="pl-4 font-normal text-gray-800">{singleJob.jobType}</span>
        </h1>
        <h1 className="font-bold my-1">
          Post Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleJob.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Description;
