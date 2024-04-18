import React from 'react'

const SignUpPage = () => {

    const partnershipData = [
        {
          icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/87cdf55347ad3b14376fbc3ffee246efd84797be924263ba2edb76855633abb5?apiKey=966c510a434d496c8209492887da4d0c&",
          text: "Return Home",
        },
      ];
      
      const InputField = ({ icon, placeholder, type = "text" }) => (
        <div className="flex gap-3 px-5 py-6 mt-5 max-w-full text-base leading-7 bg-white border border-solid border-neutral-500 text-neutral-700 w-[420px]">
          <img loading="lazy" src={icon} alt="" className="shrink-0 w-6 aspect-square" />
          <input
            type={type}
            className="flex-auto my-auto bg-transparent outline-none"
            placeholder={placeholder}
            aria-label={placeholder}
          />
        </div>
      );
      
      const PasswordField = () => (
        <div className="flex gap-5 -between px-5 py-6 mt-5 max-w-full whitespace-nowrap bg-white border border-solid border-neutral-500 w-[420px]">
          <div className="flex gap-3 text-base leading-7 text-neutral-700">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/75f8b936971eb1954e56bf4cffa47e242bd57bbdd7d30df79e1e5b447dcc8078?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 w-6 aspect-square" />
            <input
              type="password"
              className="my-auto bg-transparent outline-none"
              placeholder="*********"
              aria-label="Password"
            />
          </div>
          <button type="button" className="my-auto text-xs leading-6 text-right text-neutral-400">
            SHOW
          </button>
        </div>
      );
      
      const SignUpForm = () => (
        <form>
          <InputField icon="https://cdn.builder.io/api/v1/image/assets/TEMP/f293628d6139f61f9752967ab92fd846bdbe86c00cd3da208b2105410456b872?apiKey=966c510a434d496c8209492887da4d0c&" placeholder="Johnson Doe" />
          <InputField icon="https://cdn.builder.io/api/v1/image/assets/TEMP/073c835f77cb9025da8b741f2c5728b86a3a2b19714a715f6697d2c4fb8e70a4?apiKey=966c510a434d496c8209492887da4d0c&" placeholder="example@email.com" type="email" />
          <PasswordField />
          <button
            type="submit"
            className="flex gap-5 px-9 py-5 mt-5 max-w-full text-base leading-7 text-white bg-slate-800 w-[420px] max-md:px-5"
          >
            <span className="flex-auto my-auto">Become a Member</span>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f618e2f93cbe9087957df2e4699152052a8822edd8c0af2b03c042d5a0d78cf?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 w-8 aspect-square" />
          </button>
        </form>
      );

  return (
    <div className="pr-16 bg-gray-50 max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow justify-center px-px w-full text-center max-md:mt-5 max-md:max-w-full">
            <div className="flex overflow-hidden relative flex-col px-11 py-20 w-full min-h-[900px] max-md:px-5 max-md:max-w-full">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd9a211f424de7005b3462a65a7e3c70ad79833b2a345223dc6805aa0d720d6b?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="object-cover absolute inset-0 size-full" />
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/09b1f6122fe4455c93254471095c8f8819082b8885342cfd4dceaba95a6108e8?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="self-center mt-14 max-w-full aspect-[4.35] w-[232px] max-md:mt-10" />
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
              {partnershipData.map(({ icon, text }) => (
                <div key={text} className="flex gap-1.5 leading-[176%] text-neutral-700">
                  <img loading="lazy" src={icon} alt="" className="shrink-0 w-6 aspect-square" />
                  <div className="my-auto">{text}</div>
                </div>
              ))}
              <div className="flex-auto self-start mt-3 underline text-neutral-800">
                <span className="text-neutral-700">Already a Member?</span>
                <a href="#" className="font-bold underline text-neutral-800">
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
            <SignUpForm />
            <div className="flex gap-5 self-stretch px-px mt-48 w-full text-sm leading-6 max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
              <div className="flex-auto tracking-tight text-neutral-400">
                Copyright 2021 - 2022 FoxHub Inc. All rights Reserved
              </div>
              <div className="flex gap-2.5 text-neutral-700">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/210e9901933e4703472b8ed864ffeb667e08782f770d8a72bcd60082fd36338f?apiKey=966c510a434d496c8209492887da4d0c&" alt="" className="shrink-0 aspect-square w-[18px]" />
                <div>Need help?</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage