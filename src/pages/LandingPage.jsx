import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../routes/urlHandler';
import Swal from 'sweetalert2';

const LandingPage = () => {

  // const token = localStorage.getItem("token");
  const token = "12345"
  const navigate = useNavigate();
  const [clientData, setClientData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState("");
  const [client, setClient] = useState('');
  const [foundClient, setFoundClient] = useState(clientData);
  const [userDropdown, setUserDropdown] = useState('hidden');
  const [isModalOpen, setIsModalOpen] = useState('hidden');
  const [isClientModalOpen, setIsClientModalOpen] = useState('hidden');
  const [inputValue, setInputValue] = useState({
    clientid: "",
    clientname: "",
    clientaddress: "",
  });

  const { clientid, clientname, clientaddress } = inputValue;

  const dummyArr = [
    {
      Value: "123",
      Text: "Raymon pogi",
      // clientaddress: "address ni raymon",
    },
    {
      Value: "123",
      Text: "Raymon pogi",
    },
    {
      Valu: "123",
      Text: "Raymon pogi",
    }
  ]

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
    if(initialData == "" || initialData == undefined){
      setFoundClient(clientData)
    }
    setFoundClient(dummyArr)
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
        Swal.fire({
          title: "Client Add Failed ",
          text: "Client name already exist!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          // setIsModalOpen('hidden');
        })
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
    console.log("Raymon")
    const parentElement = e.target.closest("#parentElement");
    const clientId = parentElement.getAttribute('data-key');
    
    const dummyArrUpdate = {
      ClientId: "1234",
      ClientName: "Raymon",
      ClientAddress: "asdfasfasf address"
    }
    
    // try {
      // const { data } = await axios.get(
      //   `${base_url}/GetClientInfo/` + clientId,
      //   {
      //     headers: {
      //       'Authorization': 'Bearer ' + token
      //     }
      //   }
      // );
      // const { ReturnMsg, ClientProfile } = data;
      // if (ReturnMsg === "Success") {
        setIsClientModalOpen('block');
        setInputValue({
          ...inputValue,
          clientid: dummyArrUpdate.ClientId,
          clientname: dummyArrUpdate.ClientName,
          clientaddress: dummyArrUpdate.ClientAddress
        });
    //   } else {
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
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

  const handleUserDropdown = () => {
    if (userDropdown === 'hidden') {
      setUserDropdown('block');
    } else {
      setUserDropdown('hidden');
    }
  }

  const handleSearchBar = (e) => {
    const searchInput = e.target.value;
    setInitialData(searchInput);
    if (searchInput !== '') {
      const results = clientData.filter((user) => {
        return user.Text.toLowerCase().startsWith(searchInput.toLowerCase());
      });
      setFoundClient(results);
    } else {
      setFoundClient(clientData);
      console.log("raymon")
    }

    setClient(searchInput);
  }

  return (
    <div className="font-[sans-serif] text-[#333] bg-gray-50 p-4">
      <div className="max-w-5xl max-sm:max-w-sm mx-auto">
        <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
          <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[60px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[80px]'>
            <div className="flex flex-row-reverse lg:flex-row items-center justify-between w-full" >
              <div className="items-center mb-2 lg:mb-0 hidden sm:hidden md:hidden lg:flex xl:flex" >
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" className='shrink w-55 h-14 mr-4' />
                <span className="font-bold text-3xl text-white max-md:mt-10">
                  COSMOHUB
                </span>
              </div>
              <div className='text-sm flex items-center rounded px-2 py-2 transition-all'>
                <div class='flex items-center max-sm:ml-auto space-x-6'>
                  <ul>
                    <li
                      class="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" class="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                        viewBox="0 0 512 512">
                        <path
                          d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                          data-original="#000000" />
                      </svg>
                      <div class={userDropdown + " z-50 shadow-md bg-white p-4 w-[180px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                        <h6 class="font-semibold cursor-pointer hover:text-slate-400">User Settings</h6>
                        <h6 class="font-semibold cursor-pointer hover:text-slate-400" onClick={handleLogOut}>Logout</h6>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
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


        <div
          className={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
          <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
            <div className="flex items-center pb-3 border-b text-black">
              <h3 className="text-xl font-bold flex-1">Add Client</h3>
              <svg onClick={handleAddModalClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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
              <form onSubmit={handleAddClient} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                <div className="flex items-center">
                  <label className="text-gray-400 w-36 text-sm">Client :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter clients name"
                    value={clientname}
                    required
                    autoComplete='off'
                    onChange={handleOnChange}
                    className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div className="flex items-center">
                  <label className="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter clients address"
                    value={clientaddress}
                    required
                    autoComplete='off'
                    onChange={handleOnChange}
                    className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <button type="submit"
                  className="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block">Submit</button>
              </form>
            </div>
          </div>
        </div>
        <div
          className={isClientModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
          <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
            <div className="flex items-center pb-3 border-b text-black">
              <h3 className="text-xl font-bold flex-1">Update Client</h3>
              <svg onClick={handleUpdateClientClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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
              <form onSubmit={handleSubmitUpdate} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                <div className="flex items-center">
                  <label className="text-gray-400 w-36 text-sm">Client :</label>
                  <input
                    type="text"
                    id="clientname"
                    name="clientname"
                    placeholder="Enter clients name"
                    value={clientname}
                    required
                    onChange={handleOnChange}
                    autoComplete='off'
                    className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <div className="flex items-center">
                  <label className="text-gray-400 w-36 text-sm">Address :</label>
                  <input
                    type="text"
                    id="clientaddress"
                    name="clientaddress"
                    placeholder="Enter clients address"
                    value={clientaddress}
                    required
                    onChange={handleOnChange}
                    autoComplete='off'
                    className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                </div>
                <button type="submit"
                  className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update</button>
              </form>
            </div>
          </div>
        </div>
        <div className='w-full overflow-x-auto mt-10'>
          {/* <header class='flex shadow-md bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50'> */}
          <div class='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full'>

            <div class='flex items-center'>
              <div
                  class=" border-2 bg-gray-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" class="fill-gray-400 mr-3">
                    <path
                      d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                  </svg>
                  <input type='text' value={client} onChange={handleSearchBar} placeholder='Search...' class="w-full outline-none bg-transparent text-black text-sm" />        
                
                </div>
              <button type="button"
                onClick={handleAddModalOpen}
                className="h-[40px] w-[220px] sm:w-[240px] md:w-[200px] lg:w-[200px] xl:w-[200px] px-4 py-2.5 flex items-center text-[#fff] rounded-sm text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" className="mr-2" viewBox="0 0 6.35 6.35">
                  <path fillRule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paint-order="stroke fill markers" />
                </svg>
                Add Client
              </button>
            </div>
          </div>
          {/* </header> */}
          <table className='min-w-full bg-white font-[sans-serif]'>
            <thead className="bg-gray-800 whitespace-nowrap">
              <tr>
                <th className="w-full px-6 py-3 text-left font-semibold text-white text-lg">
                  Client
                </th>
                <th className="w-full px-6 py-3 text-left text-sm font-semibold text-white">
                </th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap divide-y divide-gray-200 border-l-2 border-r-2 border-b-2">
              {foundClient && foundClient.length > 0? foundClient.map((clientInfo) => {
                // console.log(clientInfo)
                return (
                  <tr className='hover:bg-blue-50' key={clientInfo.Value} id="parentElement" data-key={clientInfo.Value}>
                    <td className="px-6 py-4 text-sm">
                      {clientInfo.Text}
                    </td>
                    <td className="px-6 py-4">
                      <button className="mr-4" title="UpdateClient" onClick={handleUpdateClient}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="w-6 h-6 hover:stroke-slate-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>

                      </button>
                      <button className="mr-4" title="OpenClient" onClick={handleOpenClientInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="w-6 h-6 hover:stroke-slate-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>

                      </button>
                    </td>
                  </tr>
                  // <div key={clientInfo.Value} id="parentElement" data-key={clientInfo.Value} className="bg-gradient-to-r from-slate-200 to-slate-500 cursor-pointer rounded-md hover:scale-105 transition-all duration-500 mt-1">
                  //   <div className="flex flex-col justify-between items-start sm:flex-row sm:items-center border-dotted border-2 border-slate-600">
                  //     <h1 className="text-md font-semibold px-4 sm:px-6 truncate sm:w-2/3 lg:px-4">{clientInfo.Text}</h1>
                  //     <div className='flex justify-end sm:flex-row sm:w-1/3 sm:px-4'>
                  //       <button
                  //         type="button"
                  //         onClick={handleUpdateClient}
                  //         className="m-1 px-3 py-2 rounded text-white text-xs sm:text-sm tracking-wider font-semibold border-none outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-500">
                  //         <span className="sm:hidden">Update</span>
                  //         <span className="hidden sm:inline">Update info</span>
                  //       </button>
                  //       <button
                  //         type="button"
                  //         onClick={handleOpenClientInfo}
                  //         className="m-1 px-3 py-2 rounded text-white text-xs sm:text-sm tracking-wider font-semibold border-none outline-none bg-slate-700 hover:bg-slate-700 active:bg-slate-500">
                  //         <span className="sm:hidden">Open</span>
                  //         <span className="hidden sm:inline">Open Contact info</span>
                  //       </button>
                  //     </div>
                  //   </div>
                  //   <p id="childElement" className="hidden">{clientInfo.Value}</p>
                  // </div>
                )

              }) :
              <td className="px-6 py-4 text-sm">
              No Client Found.
            </td>
                }
            </tbody>
          </table>
        </div>


      </div>
    </div>
  )
}

export default LandingPage