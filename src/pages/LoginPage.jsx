import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../routes/urlHandler';

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        username: "",
        userpass: "",
    });
    const [passwordType, setPasswordType] = useState('password');
    const [showHide, setShowHide] = useState("SHOW");
    const [errorHandler, setErrorHandler] = useState('hidden');
    const { username, userpass } = inputValue;

    const handleOnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

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
                `${base_url}/Postlogin`,
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
                setErrorHandler('block')
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
        <div class="font-sans text-[#333] bg-gray-50 p-4">
            <div class="max-w-full mx-auto">
                <div class="flex flex-col md:flex-row md:space-x-5">
                    <div class="md:w-1/2">
                        <div class="px-px w-full text-center">
                            <div class="flex overflow-hidden relative flex-col w-full max-md:px-5 max-md:max-w-full bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[300px] sm:h-[4vh] md:h-[560px] lg:h-[560px] xl:h-[560px]">
                                {/* <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd9a211f424de7005b3462a65a7e3c70ad79833b2a345223dc6805aa0d720d6b?apiKey=966c510a434d496c8209492887da4d0c&" alt="" class="object-cover absolute inset-0 size-full mt-10 blur-2xl" /> */}
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d95a1b51139ebb63c90dd07fe1c74cb68c608f487830ce20a96be3c54ebc6034?apiKey=966c510a434d496c8209492887da4d0c&" alt="Partnership for Business Growth logo" class="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
                                <div class="flex-auto my-auto">
                                    <span class="font-bold text-3xl text-white max-md:mt-10">COSMOHUB</span>
                                </div>
                                {/* <h1 class="relative mt-96 mb-10 text-4xl font-black leading-10 text-white max-md:mt-10">
                             Partnership for Business Growth
                        </h1> */}
                            </div>
                        </div>
                    </div>
                    <div class="md:w-1/2">
                        <main class="flex flex-col items-center justify-center mt-10">
                            {/* <Header /> */}
                            <h2 class=" text-2xl font-black leading-10 text-center text-neutral-800">
                                WELCOME BACK EXCLUSIVE MEMBER
                            </h2>
                            <p class="mt-8 text-base leading-7 text-center uppercase text-neutral-700">
                                LOG IN TO CONTINUE
                            </p>

                            <form onSubmit={handleSubmit} class="max-w-[420px] mx-auto">
                                <div class={`${errorHandler} mt-2 bg-red-100 text-red-800 w-[380px] p-4 rounded-md relative`} role="alert">
                                    <strong class="font-bold text-base">Invalid Login!</strong>
                                    <span class="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">Incorrect username or password.</span>
                                </div>
                                <div class="flex gap-3 px-5 py-6 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid border-neutral-500 text-neutral-700 w-[380px] max-md:mt-10">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="username icon" class="shrink-0 w-6 aspect-square" />
                                    <label for="username" class="sr-only">username</label>
                                    <input class="flex-auto my-auto bg-transparent border-none focus:outline-none" type="username" id="username" name="username" value={username} required onChange={handleOnChange} placeholder="username" />
                                </div>
                                <div class="border-color red">
                                    <div class="flex gap-5 justify-between px-5 py-6 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[380px]">
                                        <div class="flex gap-3 text-base leading-7 text-neutral-700">
                                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="userpass icon" class="shrink-0 w-6 aspect-square" />
                                            <label for="userpass" class="sr-only">userpass</label>
                                            <input class="flex-auto my-auto bg-transparent border-none focus:outline-none" type={passwordType} id="userpass" name="userpass" placeholder="*********" value={userpass} required onChange={handleOnChange} />
                                        </div>
                                        <div class="my-auto text-xs leading-6 text-right text-neutral-400">
                                            <a class="font-bold text-neutral-800">
                                                <label class="cursor-pointer" onClick={handleShowPass} for="check">{showHide}</label>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" class="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[380px] max-md:px-5">
                                    <span class="flex-auto my-auto">Proceed to my Account</span>
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="Proceed icon" class="shrink-0 w-8 aspect-square" />
                                </button>
                            </form>
                            {/* <div class="mt-12 text-sm leading-6 text-right text-black cursor-pointer">
                        Having Issues with your Account?
                    </div> */}
                        </main>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage