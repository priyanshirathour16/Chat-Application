import React, { useState, useEffect } from "react";
import both from "../../image/both.png";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  //  ============= For Login======================

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const valueHandler = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  console.log(data);
  const submitHandler = async (e) => {
    e.preventDefault();

    const { email, password } = data;
    if (!email || !password) {
      toast({
        title: "Please fill all the fields !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }

    try {
      const response = await fetch("http://localhost:8800/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const Data = await response.json();
      console.log("the response is ======================", Data);
      if (Data.success === true) {
        toast({
          title: "Successfully Login !",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        setData({
          ...data,
          email: "",
          password: "",
        });
        localStorage.setItem("userInfo", JSON.stringify(Data));
        navigate("/chats");
      } else {
        toast({
          title: " Error Occur !",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        title: " Error Occur !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <div className="w-screen min-h-full bg-sky-400 flex justify-center">
      <div className="flex justify-center w-5/6	 mt-20	">
        <div className="  bg-slate-100 h-min	 p-12 rounded-sm	font-sans font-semibold">
          <div className=" flex justify-around  text-center">
            <img src={both} alt="image" className="w-20 rounded-full" />
          </div>
          <form method="POST">
            <div className="pt-4">
              <label>
                <i class="fa-solid fa-envelope pr-2"></i> Email
              </label>
              <br />

              <input
                type="email"
                className="email w-full rounded-full p-1 border border-sky-600"
                value={data.email}
                onChange={valueHandler}
                name="email"
              />
            </div>

            <div className="pt-4">
              <label>
                <i class="fa-solid fa-lock pr-2"></i> Password
              </label>
              <br />
              <input
                type="password"
                className="password w-full rounded-full p-1 border border-sky-600"
                value={data.password}
                onChange={valueHandler}
                name="password"
              />
            </div>

            <div className="pt-4 text-center">
              <button
                class="bg-sky-500 w-full hover:bg-sky-700 pl-2 pr-2 pt-1 pb-1  rounded-full"
                onClick={submitHandler}
              >
                Login
              </button>
            </div>
          </form>

          <div className="pt-4">
            Not an Account ?
            <Link to="/" className="text-sky-600 ">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
