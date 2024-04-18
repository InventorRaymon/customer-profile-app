import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });
    const { email, password } = inputValue;
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "http://localhost:3001/login",
                {
                    ...inputValue,
                },
                { withCredentials: true }
            );
            const { success, message } = data;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
    };

    function Header() {
        return (
            <header className="flex gap-5 self-stretch w-full text-sm text-center max-md:flex-wrap max-md:max-w-full">
                <div className="flex gap-1.5 leading-[176%] text-neutral-700">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/af82d5d1b1739694ac746c2429bafbdf1c3657e6e9e5f7cc032aee53d29c4e78?apiKey=966c510a434d496c8209492887da4d0c&" alt="Return home icon" className="shrink-0 w-6 aspect-square" />
                    <div className="my-auto">Return Home</div>
                </div>
                <div className="flex-auto self-start mt-3 underline text-neutral-800">
                    <span className="text-neutral-700">Not a member yet?</span>
                    <a href="#" className="font-bold underline text-neutral-800">
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
                    Copyright 2021 - 2022 FoxHub Inc. All rights Reserved
                </div>
                <div className="flex gap-2.5 text-neutral-700">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1606a9b395bcfb2c9ab560494928bb93fc3031a591f7034d0c130aaf79a5f671?apiKey=966c510a434d496c8209492887da4d0c&" alt="Help icon" className="shrink-0 aspect-square w-[18px]" />
                    <div>Need help?</div>
                </div>
            </footer>
        );
    }

    function LoginForm() {
        return (
            <form onSubmit={handleSubmit}>
                <div className="flex gap-3 px-5 py-6 mt-12 max-w-full text-base leading-7 whitespace-nowrap bg-white border border-solid border-neutral-500 text-neutral-700 w-[420px] max-md:mt-10">
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/978da9f7d3913ce0456832f58efe5674d1114328f451a4700571e5971dd0038c?apiKey=966c510a434d496c8209492887da4d0c&" alt="Email icon" className="shrink-0 w-6 aspect-square" />
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        className="flex-auto my-auto bg-transparent border-none focus:outline-none"
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleOnChange}
                        placeholder="example@email.com" />
                </div>
                <div className="flex gap-5 justify-between px-5 py-6 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[420px]">
                    <div className="flex gap-3 text-base leading-7 text-neutral-700">
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9686404333324d9d51b219ae370cc2836d4b29ecd3df9f89d290521db2946d53?apiKey=966c510a434d496c8209492887da4d0c&" alt="Password icon" className="shrink-0 w-6 aspect-square" />
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            className="flex-auto my-auto bg-transparent border-none focus:outline-none"
                            type="password"
                            id="password"
                            placeholder="*********"
                            value={password}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                        SHOW
                    </div>
                </div>
                <button type="submit" className="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[420px] max-md:px-5">
                    <span className="flex-auto my-auto"><Link to={"/login"}>Proceed to my Account</Link></span>
                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9f0ba8961bab4a6601d301bf79dfca9b8ed0f7647684e6050b380c7df8b9e03?apiKey=966c510a434d496c8209492887da4d0c&" alt="Proceed icon" className="shrink-0 w-8 aspect-square" />
                </button>
                <div className="mt-12 text-sm leading-6 text-right text-black max-md:mt-10">
                    Having Issues with your Password?
                </div>
            </form>
        );
    }



    return (
        <div className="pr-16 bg-gray-50 max-md:pr-5">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-col grow justify-center px-px w-full text-center max-md:mt-5 max-md:max-w-full">
                        <div className="flex overflow-hidden relative flex-col px-11 py-20 w-full min-h-[900px] max-md:px-5 max-md:max-w-full">
                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd9a211f424de7005b3462a65a7e3c70ad79833b2a345223dc6805aa0d720d6b?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="object-cover absolute inset-0 size-full" />
                            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/5bd92476b4a8bf0fb2c6da1a4e60fe8b4c6e32db242f04992797fc9810e836ce?apiKey=966c510a434d496c8209492887da4d0c&" alt="Partnership for Business Growth logo" className="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
                            <h1 className="relative mt-96 text-4xl font-black leading-10 text-white max-md:mt-10">
                                Partnership for Business Growth
                            </h1>
                            <p className="relative mt-4 mb-12 text-base leading-7 text-stone-300 max-md:mb-10">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun.
                            </p>
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
                        <LoginForm />
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default LoginPage