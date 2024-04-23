import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import urlHandler from "../routes/urlHandler"

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        username: "",
        userpass: "",
    });
    const [passwordType, setPasswordType] = useState('password');
    const [showHide, setShowHide] = useState("SHOW");
    const { username, userpass } = inputValue;

    const handleOnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    // const handleError = (err) =>
    //     toast.error(err, {
    //         position: "bottom-left",
    //     });
    // const handleSuccess = (msg) =>
    //     toast.success(msg, {
    //         position: "bottom-left",
    // });

    const handleShowPass = () => {
        if (passwordType === 'password') {
            setShowHide("HIDE");
            setPasswordType('text')
        } else {
            setShowHide("SHOW")
            setPasswordType('password')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://172.16.61.121:7001/api/mobileapi/Postlogin",
                {
                    ...inputValue,
                },
                { withCredentials: true },
            );

            const { ReturnMsg, UserInfo } = data;
            if (ReturnMsg === "Success") {
                localStorage.setItem("token", UserInfo.UserPass);
                setTimeout(() => {
                    navigate("/landing",
                        {
                            state: {
                                UserInfo
                            }
                        }
                    );
                }, 1000);
            } else {
                // handleError(message);
            }
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            username: "",
            userpass: "",
        });
    };
    
    function Header() {
        return (
            <header className="flex gap-5 self-stretch w-full text-sm text-center max-md:flex-wrap max-md:max-w-full">
                {/* <div className="flex gap-1.5 leading-[176%] text-neutral-700">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/af82d5d1b1739694ac746c2429bafbdf1c3657e6e9e5f7cc032aee53d29c4e78?apiKey=966c510a434d496c8209492887da4d0c&" alt="Return home icon" className="shrink-0 w-6 aspect-square" />
                    <div className="my-auto">Return Home</div>
                </div> */}
                <div className="flex-auto self-start mt-3 underline text-neutral-800">
                    <span className="text-neutral-700">Not a member yet?</span>
                    <a href="/signup" className="font-bold underline text-neutral-800">
                        {" "}
                        JOIN NOW
                    </a>
                </div>
            </header>
        );
    }

    function Footer() {
        return (
            <footer className="flex gap-5 self-stretch mt-56 w-full text-sm leading-6 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                <div className="flex-auto tracking-tight text-neutral-400">
                    Copyright 2024 Cosmotech Inc. All rights Reserved
                </div>
                <div className="flex gap-2.5 text-neutral-700">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1606a9b395bcfb2c9ab560494928bb93fc3031a591f7034d0c130aaf79a5f671?apiKey=966c510a434d496c8209492887da4d0c&" alt="Help icon" className="shrink-0 aspect-square w-[18px]" />
                    <div>Need help?</div>
                </div>
            </footer>
        );
    }


    return (
        <div className=" bg-gray-50 flex-none md:flex-1">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow justify-center px-px w-full text-center max-md:mt-5 max-md:max-w-full">
                        <div className="flex overflow-hidden relative flex-col px-11 py-20 w-full min-h-[900px] max-md:px-5 max-md:max-w-full bg-gradient-to-r from-slate-900 via-violet-500 via-50% to-slate-900 to 90%">
                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd9a211f424de7005b3462a65a7e3c70ad79833b2a345223dc6805aa0d720d6b?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="object-cover absolute inset-0 size-full" />
                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d95a1b51139ebb63c90dd07fe1c74cb68c608f487830ce20a96be3c54ebc6034?apiKey=966c510a434d496c8209492887da4d0c&" alt="Partnership for Business Growth logo" className="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
                            <div className="flex-auto my-auto">
                                <span className="font-bold text-3xl text-white max-md:mt-10">COSMOHUB</span>
                            </div>
                            <h1 className="relative mt-96 text-4xl font-black leading-10 text-white max-md:mt-10">
                                Partnership for Business Growth
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ml-5 w-[65%] max-md:ml-0 max-md:w-full">
                    <main className="flex flex-col items-center self-stretch my-auto max-md:mt-10 max-md:max-w-full">
                        <Header />
                        <h2 className="mt-32 text-2xl font-black leading-10 text-center text-neutral-800 max-md:mt-10 max-md:max-w-full">
                            WELCOME BACK EXCLUSIVE MEMBER
                        </h2>
                        <p className="mt-8 text-base leading-7 text-center uppercase text-neutral-700">
                            LOG IN TO CONTINUE
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex gap-3 px-5 py-6 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid border-neutral-500 text-neutral-700 w-[420px] max-md:mt-10">
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="username icon" className="shrink-0 w-6 aspect-square" />
                                <label htmlFor="username" className="sr-only">username</label>
                                <input
                                    className="flex-auto my-auto bg-transparent border-none focus:outline-none"
                                    type="username"
                                    id="username"
                                    name="username"
                                    value={username}
                                    required
                                    onChange={handleOnChange}
                                    placeholder="username"
                                />
                            </div>
                            <div className='border-color red'>
                                <div className="flex gap-5 justify-between px-5 py-6 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[420px]">
                                    <div className="flex gap-3 text-base leading-7 text-neutral-700">
                                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" className="shrink-0 w-6 aspect-square" />
                                        <label htmlFor="userpass" className="sr-only">userpass</label>
                                        <input
                                            className="flex-auto my-auto bg-transparent border-none focus:outline-none"
                                            type={passwordType}
                                            id="userpass"
                                            name="userpass"
                                            placeholder="*********"
                                            value={userpass}
                                            required
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                                        <a className="font-bold text-neutral-800">
                                            <label className='cursor-pointer' onClick={handleShowPass} for="check">{showHide}</label>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[420px] max-md:px-5">
                                <span className="flex-auto my-auto">Proceed to my Account</span>
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="Proceed icon" className="shrink-0 w-8 aspect-square" />
                            </button>
                            <div className="mt-12 text-sm leading-6 text-right text-black max-md:mt-10 cursor-pointer">
                                Having Issues with your Account?
                            </div>
                        </form>
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default LoginPage