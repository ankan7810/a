// import React, { useEffect, useState } from "react";
// import Navbar from "../components_lite/Navbar";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Navigate, useNavigate } from "react-router-dom";
// import { RadioGroup } from "../ui/radio-group";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "sonner";
// import { USER_API_ENDPOINT } from "@/utils/data.js";
// import { useDispatch, useSelector } from "react-redux";
// import { setLoading, setUser } from "@/redux/authSlice";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

// const Login = () => {
//   const [input, setInput] = useState({
//     email: "",
//     password: "", 
//     role: "",
//   });
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, user } = useSelector((store) => store.auth);
//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };
//   const ChangeFilehandler = (e) => {
//     setInput({ ...input, file: e.target.files?.[0] });
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       dispatch(setLoading(true)); // Start loading
//       const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true,
//       });
//       if (res.data.success) {
//         dispatch(setUser(res.data.user));
//         navigate("/");
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       toast.error("Login failed");
//     } finally {
//       dispatch(setLoading(false)); // End loading
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       navigate("/");
//     }
//   }, []);

//   return (
//     <div>
//       <Navbar></Navbar>
//       <div className="flex items-center justify-center max-w-7xl mx-auto">
//         <form
//           onSubmit={submitHandler}
//           className="w-1/2 border border-gray-500 rounded-md p-4 my-10"
//         >
//           <h1 className="font-bold text-xl mb-5 text-center text-blue-600">
//             Login
//           </h1>
//           <div className="my-2">
//             <Label>Email</Label>
//             <Input
//               type="email"
//               value={input.email}
//               name="email"
//               onChange={changeEventHandler}
//               placeholder="johndoe@gmail.com"
//             ></Input>
//           </div>
//           <div className="my-2">
//             <Label>Password</Label>
//             <Input
//               type="password"
//               value={input.password}
//               name="password"
//               onChange={changeEventHandler}
//               placeholder="********"
//             ></Input>
//           </div>
           

//           <div className="flex items-center justify-between">
//             <RadioGroup className="flex items-center gap-4 my-5 ">
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="radio"
//                   name="role"
//                   value="Student"
//                   checked={input.role === "Student"}
//                   onChange={changeEventHandler}
//                   className="cursor-pointer"
//                 />
//                 <Label htmlFor="r1">Student</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Input
//                   type="radio"
//                   name="role"
//                   value="Recruiter"
//                   checked={input.role === "Recruiter"}
//                   onChange={changeEventHandler}
//                   className="cursor-pointer"
//                 />
//                 <Label htmlFor="r2">Recruiter</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center my-10">
//               <div className="spinner-border text-blue-600" role="status">
//                 <span className="sr-only">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <button
//               type="submit"
//               className="w-3/4 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-blue-600 hover:bg-blue-800/90 rounded-md"
//             >
//               Login
//             </button>
//           )}

//           <div className=" ">
//             <p className="text-gray-700  text-center my-2">
//               Create new Account{" "}
//               <Link to="/register" className="text-blue-700">
//                 <button className=" w-1/2 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-green-600 hover:bg-green-800/90 rounded-md">
//                   Register
//                 </button>
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;








import { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.email || !input.password || !input.role) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed",error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Redirect immediately when user logs in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-500 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5 text-center text-blue-600">
            Login
          </h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="johndoe@gmail.com"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={input.role === "Student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Login Button with Spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-3/4 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-blue-600 hover:bg-blue-800/90 rounded-md"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              "Login"
            )}
          </button>

          <div>
            <p className="text-gray-700 text-center my-2">
              Create new Account{" "}
              <Link to="/register" className="text-blue-700">
                <button className="w-1/2 py-3 my-3 text-white flex items-center justify-center max-w-7xl mx-auto bg-green-600 hover:bg-green-800/90 rounded-md">
                  Register
                </button>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;