import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../routes/urlHandler';

const LandingPage = () => {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [isBurgMenuOpen, setIsBurgMenuOpen] = useState('hidden');
  const [isModalOpen, setIsModalOpen] = useState('hidden');
  const [isClientModalOpen, setIsClientModalOpen] = useState('hidden');
  const [inputValue, setInputValue] = useState({
    clientid: "",
    clientname: "",
    clientaddress: "",
  });

  const { clientid, clientname, clientaddress } = inputValue;

  const getClientList = async () => {
    try {
      const { data } = await axios.get(
        `${base_url}/GetAllCLient`,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      setClientData(data.SelectListItem);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClientList();
  }, [clientData]);

  const handleToggleClose = () => {
    setIsBurgMenuOpen('hidden');
  }

  const handleAddModalOpen = () => {
    setIsModalOpen('block');
  }

  const handleAddModalClose = () => {
    setIsModalOpen('hidden');
  }

  const handleUpdateClientOpen = () => {
    setIsClientModalOpen('block');
  }

  const handleUpdateClientClose = () => {
    setInputValue({
      ...inputValue,
      clientid: "",
      clientname: "",
      clientaddress: ""
    });
    setIsClientModalOpen('hidden');
  }

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${base_url}/PostClient`,
        {
          ...inputValue,
        },
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg } = data;
      if (ReturnMsg === "Success") {
        // setTimeout(() => {
        setIsModalOpen('hidden');
        // navigate("/landing");
        // }, 800);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      clientid: "",
      clientname: "",
      clientaddress: ""
    });
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    
    const parentElement = e.target.closest("#parentElement");
    const clientId = parentElement.getAttribute('data-key');
    try {
      const { data } = await axios.get(
        `${base_url}/GetClientInfo/` + clientId,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg, ClientProfile } = data;
      if (ReturnMsg === "Success") {

        setIsClientModalOpen('block');

        setInputValue({
          ...inputValue,
          clientid: ClientProfile.ClientId,
          clientname: ClientProfile.ClientName,
          clientaddress: ClientProfile.ClientAddress
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenClientInfo = async (e) => {

    const parentElement = e.target.closest("#parentElement");
    const clientId = parentElement.getAttribute('data-key');

      setTimeout(() => {
        navigate("/clientcontacts",
          {
            state: {
              clientId
            }
          }
        );
      }, 1000);
      
  }

  const handleSubmitUpdate = async (e) => {
    const tokenUpdate = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `${base_url}/PostClient`,
        {
          ...inputValue
        },
        {
          headers: {
            'Authorization': 'Bearer ' + tokenUpdate
          }
        }
      );
      
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div class="font-[sans-serif] text-[#333] bg-gray-50 p-4">
      <div class="max-w-5xl max-sm:max-w-sm mx-auto">
        {/* Header Component */}
        <header class='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                <section class='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90%'>

                    <div class="flex items-center cursor-pointer" onClick={() => navigate("/landing")}>
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" class='shrink w-55 h-14 mr-4' />
                        <span class="font-bold text-3xl text-white max-md:mt-10">
                            COSMOHUB
                        </span>
                    </div>
                </section>
            </header>

        <header class='flex shadow-sm bg-white font-[sans-serif] min-h-[70px]'>
          <div
            class='flex flex-wrap items-center justify-between sm:px-10 px-6 py-3 relative lg:gap-y-4 gap-y-6 gap-x-4 w-full'>

            <div class="flex">
            </div>

            <div
              class="bg-gray-100 flex border-2 max-md:order-1 border-transparent focus-within:border-blue-500 focus-within:bg-transparent px-4 rounded-sm h-11 lg:w-2/4 max-md:w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                class="fill-gray-400 mr-4 rotate-90">
                <path
                  d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                </path>
              </svg>
              <input type='text' placeholder='Search...' class="w-full outline-none bg-transparent text-[#333] text-sm" />
            </div>

            <div class='flex items-center space-x-8 max-md:ml-auto'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" class="cursor-pointer fill-[#333] hover:fill-[#077bff]"
                viewBox="0 0 512 512">
                <path
                  d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                  data-original="#000000" />
              </svg>
            </div>
          </div>

          <div id="collapseMenu"
            class={isBurgMenuOpen + " before:fixed before:bg-black before:opacity-40 before:inset-0 max-lg:before:z-50"}>
            <button id="toggleClose" class='fixed top-2 right-4 z-[100] rounded-full bg-white p-3' onClick={handleToggleClose}>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-black" viewBox="0 0 320.591 320.591">
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"></path>
              </svg>
            </button>

            <ul
              class='block space-x-4 space-y-3 fixed bg-white w-1/2 min-w-[300px] top-0 left-0 p-4 h-full shadow-md overflow-auto z-50'>
              <li class='pb-4 px-3'>
                <a href="javascript:void(0)"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" class='w-36' />
                </a>
              </li>
              <li class='border-b pb-4 px-3 hidden'>
                <a href="javascript:void(0)"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" class='w-36' />
                </a>
              </li>
              <li class='border-b py-3 px-3'><a href='javascript:void(0)'
                class='hover:text-[#007bff] text-black block font-semibold text-base'>Add Customer</a>
              </li>
              <li class='border-b py-3 px-3'><a href='javascript:void(0)'
                class='hover:text-[#007bff] text-black block font-semibold text-base'>Delete Customer</a>
              </li>
              <li class='border-b py-3 px-3'><a href='javascript:void(0)'
                class='hover:text-[#007bff] text-black block font-semibold text-base'>Blog</a>
              </li>
              <li class='border-b py-3 px-3'><a href='javascript:void(0)'
                class='hover:text-[#007bff] text-black block font-semibold text-base'>About</a>
              </li>
              <li class='border-b py-3 px-3'><a href='javascript:void(0)'
                class='hover:text-[#007bff] text-black block font-semibold text-base'>Contact</a>
              </li>
            </ul>
          </div>
        </header>
        {/* Contact Persons List */}
        
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="flex relative w-auto my-6 mx-auto max-w-6xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Clients Contact Persons
                    </h3>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-slate-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        {/* <SignupModal/> */}
        {/* Kanban Component */}
        <div className='place-items-center'>
          <button type="button"
            onClick={handleAddModalOpen}
            class="m-10 px-4 py-2.5 flex items-center text-[#fff] rounded-full text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" class="mr-2" viewBox="0 0 6.35 6.35">
              <path fill-rule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paint-order="stroke fill markers" />
            </svg>
            Add Client
          </button>
          {/* <button
            type="button"
            onClick={handleAddModalOpen}
            class="text-center mt-4 m-10 flex px-2 py-2.5 min-w-[120px] shadow-lg rounded-md text-black text-md tracking-wider font-medium border-none outline-none bg-white active:shadow-inner">Add Client</button> */}
        </div>


        <div
          class={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
          <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
            <div class="flex items-center pb-3 border-b text-black">
              <h3 class="text-xl font-bold flex-1">Add Client</h3>
              <svg onClick={handleAddModalClose} xmlns="http://www.w3.org/2000/svg" class="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                viewBox="0 0 320.591 320.591">
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"></path>
              </svg>
            </div>
            <div className="m-10">
              <form onSubmit={handleAddClient} class="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Id :</label>
                  <input
                    type="text"
                    id="clientid"
                    name="clientid"
                    placeholder="Enter your id"
                    value={clientid}
                    required
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Name :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter your name"
                    value={clientname}
                    required
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter your name"
                    value={clientaddress}
                    required
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <button type="submit"
                  class="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block">Submit</button>
              </form>
            </div>
          </div>
        </div>
        <div
          class={isClientModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
          <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
            <div class="flex items-center pb-3 border-b text-black">
              <h3 class="text-xl font-bold flex-1">Update Client</h3>
              <svg onClick={handleUpdateClientClose} xmlns="http://www.w3.org/2000/svg" class="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                viewBox="0 0 320.591 320.591">
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"></path>
              </svg>
            </div>
            <div className="m-10">
              <form onSubmit={handleSubmitUpdate} class="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Name :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter your name"
                    value={clientname}
                    required
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter your name"
                    value={clientaddress}
                    required
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <button type="submit"
                  class="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block">Submit</button>
              </form>
            </div>
          </div>
        </div>
        {/* <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 text-center mt-12"> */}
        <div className='w-full overflow-x-auto'>
  <table className='w-full table-striped'>
    {clientData && clientData.map((clientInfo) => {
      // console.log(clientInfo)
      return (
        <div key={clientInfo.Value} id="parentElement" data-key={clientInfo.Value} class="bg-slate-200 cursor-pointer rounded-md hover:scale-105 transition-all duration-500">
          <div class=" flex justify-between items-center border-dotted border-2 border-slate-600">
            <h1 class="text-xl font-semibold px-7">{clientInfo.Text}</h1>
            <div className='flex'>
              <button
                type="button"
                onClick={handleUpdateClient}
                class="m-2 px-6 py-2.5 rounded text-white text-sm tracking-wider font-semibold border-none outline-none bg-slate-500 hover:bg-slate-700 active:bg-slate-500">
                <span>Update info</span>
              </button>
              <button
                type="button"
                onClick={handleOpenClientInfo}
                class="m-2 px-6 py-2.5 rounded text-white text-sm tracking-wider font-semibold border-none outline-none bg-slate-500 hover:bg-slate-700 active:bg-slate-500">
                <span>Open Contact info</span>
              </button>
            </div>
          </div>
          <p id="childElement" class="hidden">{clientInfo.Value}</p>
        </div>
      );
    })}
  </table>
</div>

        </div>
      </div>
    // </div>
  )
}

export default LandingPage