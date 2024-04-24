import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../routes/urlHandler';
import Swal from 'sweetalert2';

const LandingPage = () => {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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

  const handleAddModalOpen = () => {
    setIsModalOpen('block');
  }

  const handleAddModalClose = () => {
    setIsModalOpen('hidden');
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
        Swal.fire({
          title: "Client Added",
          text: "Successfuly added a new client!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsModalOpen('hidden');
        })
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
    e.preventDefault();
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
      const { ReturnMsg } = data;
      if (ReturnMsg === "Success") {
        Swal.fire({
          title: "Client Updated",
          text: "Successfuly updated  client!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsClientModalOpen('hidden');
        })

      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogOut = () => {
    Swal.fire({
      title: "Log Out",
      text: "Are you sure you want to Log Out?",
      confirmButtonColor: "#334155",
      showCancelButton: true,
      color: "#334155",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
        localStorage.removeItem("token");
      }
    })
  }


  return (
    <div class="font-[sans-serif] text-[#333] bg-gray-50 p-4">
      <div class="max-w-5xl max-sm:max-w-sm mx-auto">
        <header class='shadow-md font-[sans-serif] tracking-wide relative z-50'>
          <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90%'>

            <div className="flex flex-col lg:flex-row items-center justify-between w-full" >
              <div className="flex items-center mb-2 lg:mb-0" >
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" className='shrink w-55 h-14 mr-4' />
                <span className="font-bold text-3xl text-white max-md:mt-10">
                  COSMOHUB
                </span>
              </div>
              <h2 className="text-2xl font-semibold flex-center text-white mb-2 lg:mb-0">Client List</h2>
              <a href="javascript:void(0)"
                onClick={handleLogOut}
                className="border-solid border-2 text-white hover:text-slate-600 text-sm flex items-center hover:bg-blue-50 rounded px-2 py-2 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-2"
                  viewBox="0 0 6.35 6.35">
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                    data-original="#000000" />
                </svg>
                <span>Logout</span>
              </a>
            </div>
          </section>
        </header>

        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="flex relative w-auto my-6 mx-auto max-w-6xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
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
        <div className='place-items-center'>
          <button type="button"
            onClick={handleAddModalOpen}
            class="m-10 px-4 py-2.5 flex items-center text-[#fff] rounded-full text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" class="mr-2" viewBox="0 0 6.35 6.35">
              <path fill-rule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paint-order="stroke fill markers" />
            </svg>
            Add Client
          </button>
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
                  <label class="text-gray-400 w-36 text-sm">Client :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter clients name"
                    value={clientname}
                    required
                    autoComplete='off'
                    onChange={handleOnChange}
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter clients address"
                    value={clientaddress}
                    required
                    autoComplete='off'
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
                  <label class="text-gray-400 w-36 text-sm">Client :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter clients name"
                    value={clientname}
                    required
                    onChange={handleOnChange}
                    autoComplete='off'
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div class="flex items-center">
                  <label class="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter clients address"
                    value={clientaddress}
                    required
                    onChange={handleOnChange}
                    autoComplete='off'
                    class="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <button type="submit"
                  class="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block">Submit</button>
              </form>
            </div>
          </div>
        </div>
        {/* <div className='w-full overflow-x-auto'>
          <table className='w-full table-striped'>
            {clientData && clientData.map((clientInfo) => {
              return (
                <div key={clientInfo.Value} id="parentElement" data-key={clientInfo.Value} className="bg-gradient-to-r from-slate-200 to-slate-500 cursor-pointer rounded-md hover:scale-105 transition-all duration-500 mt-1">
                  <div className="flex flex-col lg:flex-row justify-between items-center border-dotted border-2 border-slate-600">
                    <h1 className="text-xl font-semibold px-7 truncate lg:w-2/3 lg:px-4">{clientInfo.Text}</h1>
                    <div className='flex flex-col lg:flex-row items-center lg:w-1/3 lg:px-4'>
                      <button
                        type="button"
                        onClick={handleUpdateClient}
                        className="m-2 px-6 py-2.5 rounded text-white text-sm tracking-wider font-semibold border-none outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-500 lg:w-auto lg:mr-2">
                        <span>Update info</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenClientInfo}
                        className="m-2 px-6 py-2.5 rounded text-white text-sm tracking-wider font-semibold border-none outline-none bg-slate-700 hover:bg-slate-700 active:bg-slate-500 lg:w-auto">
                        <span>Open Contact info</span>
                      </button>
                    </div>
                  </div>
                  <p id="childElement" className="hidden">{clientInfo.Value}</p>
                </div>

              );
            })}
          </table>
        </div> */}
        <div className='w-full overflow-x-auto'>
  <table className='w-full table-striped'>
    {clientData && clientData.map((clientInfo) => {
      return (
        <div key={clientInfo.Value} id="parentElement" data-key={clientInfo.Value} className="bg-gradient-to-r from-slate-200 to-slate-500 cursor-pointer rounded-md hover:scale-105 transition-all duration-500 mt-1">
          <div className="flex flex-col justify-between items-start sm:flex-row sm:items-center border-dotted border-2 border-slate-600">
            <h1 className="text-md font-semibold px-4 sm:px-6 truncate sm:w-2/3 lg:px-4">{clientInfo.Text}</h1>
            <div className='flex justify-end sm:flex-row sm:w-1/3 sm:px-4'>
              <button
                type="button"
                onClick={handleUpdateClient}
                className="m-1 px-3 py-2 rounded text-white text-xs sm:text-sm tracking-wider font-semibold border-none outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-500">
                <span className="sm:hidden">Update</span>
                <span className="hidden sm:inline">Update info</span>
              </button>
              <button
                type="button"
                onClick={handleOpenClientInfo}
                className="m-1 px-3 py-2 rounded text-white text-xs sm:text-sm tracking-wider font-semibold border-none outline-none bg-slate-700 hover:bg-slate-700 active:bg-slate-500">
                <span className="sm:hidden">Open</span>
                <span className="hidden sm:inline">Open Contact info</span>
              </button>
            </div>
          </div>
          <p id="childElement" className="hidden">{clientInfo.Value}</p>
        </div>
      );
    })}
  </table>
</div>


      </div>
    </div>
  )
}

export default LandingPage