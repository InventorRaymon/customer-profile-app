import React from 'react'

const HomePage = () => {
    function Logo() {
        return (
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f93f8be0abd6d53cbb397f9311b903ea9f3402f82916f6be7b9ef7eb93373d5?apiKey=966c510a434d496c8209492887da4d0c&"
            alt="Company Logo"
            className="shrink-0 max-w-full aspect-[3.45] w-[164px]"
          />
        );
      }
      
      function NavLink({ children }) {
        return <div className="leading-[120%]">{children}</div>;
      }
      
      function NavLinkWithIcon({ children, iconSrc }) {
        return (
          <div className="flex gap-1 text-center">
            <div className="grow">{children}</div>
            <img
              loading="lazy"
              src={iconSrc}
              alt=""
              className="shrink-0 my-auto aspect-[1.12] w-[9px]"
            />
          </div>
        );
      }
      
      function Button({ children, className }) {
        return (
          <div
            className={`justify-center px-5 py-3 bg-amber-400 border-2 border-amber-400 border-solid rounded-[64px] text-zinc-900 ${className}`}
          >
            {children}
          </div>
        );
      }
  return (
    <div className="flex overflow-hidden relative flex-col justify-center min-h-[696px]">
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/775e3dba02ee2c2c355f7259090940b4068e26ee1e6bd330430de0445a6e0af7?apiKey=966c510a434d496c8209492887da4d0c&"
        alt="Background"
        className="object-cover absolute inset-0 size-full"
      />
      <div className="flex relative flex-col pb-20 w-full max-md:max-w-full">
        <header className="flex flex-col items-center px-16 pt-10 pb-1.5 w-full text-xl max-md:px-5 max-md:max-w-full">
          <div className="flex gap-5 justify-between w-full max-w-[1216px] max-md:flex-wrap max-md:max-w-full">
            <Logo />
            <nav className="flex gap-5 justify-between items-start my-auto text-white whitespace-nowrap max-md:flex-wrap">
              <div className="flex gap-5 justify-between">
                <NavLink>Features</NavLink>
                <NavLink>Pricing</NavLink>
                <NavLink>Download</NavLink>
              </div>
              <NavLinkWithIcon iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/9abe04ccb4780a6ac4946bc73215bc7a33c6620b7fa5ce1e5595204426083799?apiKey=966c510a434d496c8209492887da4d0c&">Company</NavLinkWithIcon>
              <NavLinkWithIcon iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/597b509fee50de23ae9d467b81a638a32e040f3e79861f96aba0ccb58c56b1b2?apiKey=966c510a434d496c8209492887da4d0c&">Support</NavLinkWithIcon>
            </nav>
            <div className="flex gap-5 justify-between self-start mt-2 font-medium leading-[100%]">
              <div className="my-auto text-white">Login</div>
              <Button>Sign Up</Button>
            </div>
          </div>
        </header>
        <main className="flex flex-col mt-28 mb-1.5 ml-28 max-w-full w-[589px] max-md:mt-10">
          <h1 className="text-6xl font-semibold tracking-tighter text-white leading-[64px] max-md:max-w-full max-md:text-4xl max-md:leading-[49px]">
            Securely connect any <br /> device, anywhere.
          </h1>
          <p className="mt-7 text-2xl leading-9 text-white max-md:mr-2.5 max-md:max-w-full">
            ZeroTier lets you build modern, secure multi-point <br /> virtualized
            networks of almost any type. From robust <br /> peer-to-peer
            networking to multi-cloud mesh <br /> infrastructure, we enable
            global connectivity with the <br /> simplicity of a local network.
          </p>
          <div className="flex gap-5 self-start mt-9 text-xl font-medium leading-5">
            <Button className="pr-5 py-3.5 max-md:pr-5">Get ZeroTier</Button>
            <div className="flex-auto my-auto text-white">Learn more ›</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default HomePage