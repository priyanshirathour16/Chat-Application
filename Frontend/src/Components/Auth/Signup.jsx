import React, { useState, useEffect } from "react";
import both from "../../image/both.png";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  // =========== sign up ================//
  const [data, setData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    img: "",
  });

  const handlesInput = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  // const handlesInput = (e) => {
  //   setData({
  //     name: e.target.value,
  //     email: e.target.value,
  //     number: e.target.value,
  //     pasword: e.target.value,
  //     img: e.target.file[0],
  //   });
  // };
  console.log(data);

  const userRegister = async (e) => {
    e.preventDefault();
    const { name, email, number, password, img } = data;
    if (!name || !email || !password || !number) {
      toast({
        title: "Please fill all the fields !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/");
    }

    const response = await fetch("http://localhost:8800/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        number,
        password,
        img,
      }),
    });
    const Data = await response.json();
    if (Data.success === false) {
      toast({
        title: "User Already Registered !",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setData({
        ...data,
        name: "",
        email: "",
        number: "",
        password: "",
        img: "",
      });
      navigate("/");
    }
    if (Data.success === true) {
      toast({
        title: "Successfully Register!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setData({
        ...data,
        name: "",
        email: "",
        number: "",
        password: "",
        img: "",
      });
      localStorage.setItem("userInfo", JSON.stringify(Data));
      navigate("/login");
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
                <i class="fa-solid fa-user pr-2"></i>Username
              </label>
              <br />
              <input
                type="text"
                className="username w-full rounded-full p-1 border border-sky-600	"
                value={data.name}
                onChange={handlesInput}
                name="name"
              />
            </div>

            <div className="pt-4">
              <label>
                <i class="fa-solid fa-envelope pr-2"></i> Email
              </label>
              <br />

              <input
                type="email"
                className="email w-full rounded-full p-1 border border-sky-600"
                value={data.email}
                onChange={handlesInput}
                name="email"
              />
            </div>

            <div className="pt-4">
              <label>
                <i class="fa-solid fa-phone pr-2"></i> Number
              </label>
              <br />

              <input
                type="tel"
                className="number w-full  rounded-full p-1 border border-sky-600"
                value={data.number}
                onChange={handlesInput}
                name="number"
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
                onChange={handlesInput}
                name="password"
              />
            </div>

            <div className="pt-4">
              <label>
                <i class="fa-solid fa-image pr-2"></i> Upload Image
              </label>
              <br />

              <input
                type="file"
                name="img"
                value={data.img}
                onChange={handlesInput}
              />
            </div>

            <div className="pt-4 text-center">
              <button
                class="bg-sky-500 w-full hover:bg-sky-700 pl-2 pr-2 pt-1 pb-1  rounded-full"
                onClick={userRegister}
              >
                Register
              </button>
            </div>
          </form>

          <div className="pt-4">
            Already Have an Account ?
            <Link to="/login " className="text-sky-600 ">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
