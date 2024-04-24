import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    username: "",
    userpass: "",
  });

  const [passwordType, setPasswordType] = useState('password');
  const [showHide, setShowHide] = useState("SHOW");
  const { username, userpass } = inputValue;

  const handleShowPass = () => {
    if (passwordType === 'password') {
      setShowHide("HIDE");
      setPasswordType('text')
    } else {
      setShowHide("SHOW")
      setPasswordType('password')
    }
  }

  const handleOnChange = (e) => {
    e.preventDefault();
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
        "http://172.16.61.121:7001/api/mobileapi/Postlogin",
        {
          ...inputValue,
        },
        { withCredentials: true },
      );

      const { ReturnMsg, UserInfo } = data;
      if (ReturnMsg === "Success") {
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

  return (
    <div className="flex bg-gray-50">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow justify-center px-px w-full text-center max-md:mt-5 max-md:max-w-full">
            <div className="flex overflow-hidden relative flex-col px-11 py-20 w-full min-h-[900px] max-md:px-5 max-md:max-w-full bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90%">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd9a211f424de7005b3462a65a7e3c70ad79833b2a345223dc6805aa0d720d6b?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="object-cover absolute inset-0 size-full" />
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f7be567ff398a84e469482560657981934afd9669fa8f9a5d2bb97e4f9b91d95?apiKey=966c510a434d496c8209492887da4d0c&" alt="Partnership for Business Growth logo" className="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
              <div className="flex-auto my-auto">
                <span className="font-bold text-3xl text-white max-md:mt-10">COSMOHUB</span>
              </div>
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
          <div className="flex flex-col items-center self-stretch my-auto max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 self-stretch w-full text-sm text-center max-md:flex-wrap max-md:max-w-full">
              {/* {partnershipData.map(({ icon, text }) => (
                <div key={text} className="flex gap-1.5 leading-[176%] text-neutral-700">
                  <img loading="lazy" src={icon} alt="" className="shrink-0 w-6 aspect-square" />
                  <div className="my-auto">{text}</div>
                </div>
              ))} */}
              <div className="flex-auto self-start mt-3 underline text-neutral-800">
                <span className="text-neutral-700">Already a Member?</span>
                <a href="/login" className="font-bold underline text-neutral-800">
                  {" "}
                  LOG IN NOW
                </a>
              </div>
            </div>
            <h2 className="mt-28 text-2xl font-black leading-10 text-center text-neutral-800 max-md:mt-10">
              BECOME AN EXCLUSIVE MEMBERS
            </h2>
            <p className="mt-3 text-base leading-7 text-center uppercase text-neutral-700">
              SIGN UP and join the partnership{" "}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-3 px-5 py-6 mt-5 max-w-full text-base leading-7 bg-white border border-solid border-neutral-500 text-neutral-700 w-[420px]">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/f293628d6139f61f9752967ab92fd846bdbe86c00cd3da208b2105410456b872?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 w-6 aspect-square" />
                <input
                  type="username"
                  className="flex-auto my-auto bg-transparent outline-none"
                  placeholder="John Raymon"
                />
              </div>
              <div className="flex gap-3 px-5 py-6 mt-5 max-w-full text-base leading-7 bg-white border border-solid border-neutral-500 text-neutral-700 w-[420px]">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/073c835f77cb9025da8b741f2c5728b86a3a2b19714a715f6697d2c4fb8e70a4?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 w-6 aspect-square" />
                <input
                  type="email"
                  className="flex-auto my-auto bg-transparent outline-none"
                  placeholder="example@gmail.com"
                // aria-label={placeholder}
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
              <button
                type="submit"
                className="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[420px] max-md:px-5"
              >
                <span className="flex-auto my-auto">Become a Member</span>
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f618e2f93cbe9087957df2e4699152052a8822edd8c0af2b03c042d5a0d78cf?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 w-8 aspect-square" />
              </button>
            </form>
            <div className="flex gap-5 self-stretch px-px mt-48 w-full text-sm leading-6 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
              <div className="flex-auto tracking-tight text-neutral-400">
                Copyright 2024 Cosmotech Inc. All rights Reserved
              </div>
              <div className="flex gap-2.5 text-neutral-700">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/210e9901933e4703472b8ed864ffeb667e08782f770d8a72bcd60082fd36338f?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 aspect-square w-[18px]" />
                <div className='cursor-pointer'>Need help?</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage