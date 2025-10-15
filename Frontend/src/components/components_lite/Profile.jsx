// import { useState } from "react";
// import Navbar from "./Navbar";
// import { Avatar, AvatarImage } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Contact, Mail, Pen } from "lucide-react";
// import { Badge } from "../ui/badge";
// import AppliedJob from "./AppliedJob";
// import EditProfileModal from "./EditProfileModal";
// import { useSelector } from "react-redux";
// import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";

// const Profile = () => {
//   const { user } = useSelector((store) => store.auth);
//   const [open, setOpen] = useState(false);

//   // ✅ Only call for student
//   if (user?.role === "Student") {
//     useGetAppliedJobs();
//   }

//   return (
//     <div>
//       <Navbar />

//       <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-400 hover:shadow-yellow-400">
//         <div className="flex justify-between">
//           <div className="flex items-center gap-5">
//             <Avatar className="cursor-pointer h-24 w-24">
//               <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
//             </Avatar>
//             <div>
//               <h1 className="font-medium text-xl">{user?.fullname}</h1>
//               <p>{user?.profile?.bio}</p>
//             </div>
//           </div>

//           <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
//             <Pen />
//           </Button>
//         </div>

//         <div className="my-5">
//           <div className="flex items-center gap-3 my-2">
//             <Mail />
//             <span>
//               <a href={`mailto:${user?.email}`}>{user?.email}</a>
//             </span>
//           </div>
//           <div className="flex items-center gap-3 my-2">
//             <Contact />
//             <span>
//               <a href={`tel:${user?.phoneNumber}`}>{user?.phoneNumber}</a>
//             </span>
//           </div>
//         </div>

//         {/* Skills & Resume - Only for Student */}
//         {user?.role === "Student" && (
//           <>
//             <div className="my-5">
//               <h1>Skills</h1>
//               <div className="flex items-center gap-1">
//                 {user?.profile?.skills?.length !== 0 ? (
//                   user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>)
//                 ) : (
//                   <span>NA</span>
//                 )}
//               </div>
//             </div>

//             <div className="grid w-full max-w-sm items-center gap-1.5">
//               <label className="text-md font-bold">Resume</label>
//               <div>
//                 {user?.profile?.resume ? (
//                   <a
//                     target="_blank"
//                     href={user?.profile?.resume}
//                     className="text-blue-600 hover:underline cursor-pointer"
//                   >
//                     Download {user?.profile?.resumeOriginalName}
//                   </a>
//                 ) : (
//                   <span>No Resume Found</span>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Applied Jobs - Only for Student */}
//       {user?.role === "Student" && (
//         <div className="max-w-4xl mx-auto bg-white rounded-2xl">
//           <h1 className="text-lg my-5 font-bold">Applied Jobs</h1>
//           <AppliedJob />
//         </div>
//       )}

//       {/* Edit Profile Modal */}
//       <EditProfileModal open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Profile;










import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "../ui/badge";
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { setUser } from "@/redux/authSlice";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  // ✅ Fetch logged-in user using token middleware
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/profile/me`, {
        withCredentials: true, // sends token cookie
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user)); // updates redux user
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };
  fetchUser();
}, [dispatch]);


  // ✅ Only call for student
  if (user?.role === "Student") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetAppliedJobs();
  }

  return (
    <div>
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-400 hover:shadow-yellow-400">
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="cursor-pointer h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>

          <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
            <Pen />
          </Button>
        </div>

        {/* Contact Section */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>
              <a href={`tel:${user?.phoneNumber}`}>{user?.phoneNumber}</a>
            </span>
          </div>
        </div>

        {/* Skills & Resume - Only for Student */}
        {user?.role === "Student" && (
          <>
            <div className="my-5">
              <h1 className="font-semibold">Skills</h1>
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {user?.profile?.skills?.length > 0 ? (
                  user.profile.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))
                ) : (
                  <span>NA</span>
                )}
              </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label className="text-md font-bold">Resume</label>
              <div>
                {user?.profile?.resume ? (
                  <a
                    target="_blank"
                    href={user.profile.resume}
                    className="text-blue-600 hover:underline cursor-pointer"
                    rel="noreferrer"
                  >
                    Download {user.profile.resumeOriginalName || "Resume"}
                  </a>
                ) : (
                  <span>No Resume Found</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Applied Jobs - Only for Student */}
      {user?.role === "Student" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl">
          <h1 className="text-lg my-5 font-bold">Applied Jobs</h1>
          <AppliedJob />
        </div>
      )}
      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;