import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from '../routes/urlHandler';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import Logo from '../images/logo.png';
import { motion } from 'framer-motion';

const UserPage = () => {

  const token = localStorage.getItem("token");
  // const token = "12345"
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [initialData, setInitialData] = useState("");
  const [user, setUser] = useState('');
  const [foundUser, setFoundUser] = useState(userData);
  const [userDropdown, setUserDropdown] = useState('hidden');
  const [isModalOpen, setIsModalOpen] = useState('hidden');
  const [isUserModalOpen, setIsUserModalOpen] = useState('hidden');

  const [addErrorHandler, setAddErrorHandler] = useState('hidden');
  const [changePassModal, setChangePassModal] = useState('hidden');
  const [passwordType, setPasswordType] = useState('password');
  const [showHide, setShowHide] = useState("SHOW");
  const [passwordTypeNew, setPasswordTypeNew] = useState('password');
  const [showHideNew, setShowHideNew] = useState("SHOW");
  const [changePassErrorHandler, setChangePassErrorHandler] = useState('hidden');
  const [loadingDone, setLoadingDone] = useState(undefined);

  const [inputValue, setInputValue] = useState({
    userid: "",
    username: "",
    useraddress: ""

  });
  const [changepassInput, setChangepassInput] = useState({
    newpassword: "",
    confirmpassword: ""
  })
  const { newpassword, confirmpassword } = changepassInput;

  const { userid, username, useraddress } = inputValue;


  const dummyArr = [
    {
      Value: "123",
      Text: "Raymon pogi",
      // useraddress: "address ni raymon",
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

  const handleShowPass = (e) => {
    const passName = e.target.getAttribute("name");
    if (passName === "newpassword") {
      if (passwordTypeNew === 'password') {
        setShowHideNew("HIDE");
        setPasswordTypeNew('text')
      } else {
        setShowHideNew("SHOW")
        setPasswordTypeNew('password')
      }
    } else {
      if (passwordType === 'password') {
        setShowHide("HIDE");
        setPasswordType('text')
      } else {
        setShowHide("SHOW")
        setPasswordType('password')
      }
    }

  }

  const getUserList = async () => {
    try {
      const { data } = await axios.get(
        `${base_url}/GetAllUser`,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      
      const { ReturnMsg, UserList } = data;
      if(ReturnMsg === "Success"){
        setUserData(UserList);
      }
      
      setLoadingDone(true)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userData) {
      setTimeout(() => {
        getUserList();
      }, 2000)
    }

    if (initialData == "" || initialData == undefined) {
      setFoundUser(userData)
    }
    // console.log(userData)
  }, [userData]);

  const handleAddModalOpen = () => {
    setIsModalOpen('block');
  }

  const handleAddModalClose = () => {
    setIsModalOpen('hidden');
  }

  const handleUpdateUserClose = () => {
    setInputValue({
      ...inputValue,
      userid: "",
      username: "",
      useraddress: ""
    });
    setIsUserModalOpen('hidden');
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    console.log(e)
    // try {
    //   const { data } = await axios.post(
    //     `${base_url}/PostUser`,
    //     {
    //       ...inputValue,
    //     },
    //     {
    //       headers: {
    //         'Authorization': 'Bearer ' + token
    //       }
    //     }
    //   );
    //   const { ReturnMsg } = data;
    //   if (ReturnMsg === "Success") {
    //     Swal.fire({
    //       title: "User Added",
    //       text: "Successfuly added a new user!",
    //       confirmButtonColor: "#334155",
    //       color: "#334155",
    //     }).then(() => {
    //       setIsModalOpen('hidden');
    //     })
    //   } else {
    //     setAddErrorHandler('block');
    //     // Swal.fire({
    //     //   title: "User Add Failed ",
    //     //   text: "User name already exist!",
    //     //   confirmButtonColor: "#334155",
    //     //   color: "#334155",
    //     // }).then(() => {
    //     //   // setIsModalOpen('hidden');
    //     // })
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    // setInputValue({
    //   ...inputValue,
    //   userid: "",
    //   username: "",
    //   useraddress: ""
    // });
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    if (addErrorHandler === 'block') {
      setAddErrorHandler('hidden')
    }
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleOnChangePass = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setChangepassInput({
      ...changepassInput,
      [name]: value,
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const userId = e.target.id;

    try {
      const { data } = await axios.get(
        `${base_url}/GetUserInfo/` + userId,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        }
      );
      const { ReturnMsg, UserProfile } = data;
      if (ReturnMsg === "Success") {
      setIsUserModalOpen('block');
      setInputValue({
        ...inputValue,
        userid: UserProfile.UserId,
        username: UserProfile.UserName,
        useraddress: UserProfile.UserAddress
      });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOpenUserInfo = async (e) => {

    const userId = e.target.id;

    setTimeout(() => {
      navigate("/usercontacts",
        {
          state: {
            userId
          }
        }
      );
    }, 1000);

  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${base_url}/ChangesPassword`,
        {
          ...changepassInput,
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
          title: "Password Updated",
          text: "Successfuly updated password!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setChangePassModal('hidden');
        })
      } else {
        setChangePassErrorHandler('block')
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const tokenUpdate = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `${base_url}/PostUser`,
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
          title: "User Updated",
          text: "Successfuly updated user!",
          confirmButtonColor: "#334155",
          color: "#334155",
        }).then(() => {
          setIsUserModalOpen('hidden');
        })

      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogOut = () => {
    Swal.fire({
      title: "Confirm Log Out",
      text: "Are you sure you want to Log Out?",
      confirmButtonColor: "#334155",
      showCancelButton: true,
      color: "#334155",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
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
      const results = userData.filter((user) => {
        return user.Text.toLowerCase().startsWith(searchInput.toLowerCase());
      });
      setFoundUser(results);
    } else {
      setFoundUser(userData);
      console.log("raymon")
    }

    setUser(searchInput);
  }

  const handleOpenKebab = (e) => {
    const contactId = e.target.getAttribute('data-key');
    const allElements = document.getElementsByName("kebabDropdown");
    for (let index in allElements) {
      const targetElement = allElements[index];
      if (targetElement.id !== undefined && targetElement.id !== null) {
        if (contactId == targetElement.id) {
          const elementInfo = "flex flex-col p-4 z-50 bg-slate-100 p-2 w-[100px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const elementHidden = "hidden flex-col z-50 bg-slate-100 p-2 w-[100px] sm:min-w-[100px] max-sm:min-w-[100px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
          const variantClose = {
            opacity: 0, y: "-100%"
          }
          const variantOpen = {
            opacity: 1, y: 0
          }
          if (elementInfo === targetElement.className) {
            targetElement.setAttribute('class', elementHidden);
            targetElement.setAttribute('variants', variantClose);
          } else {
            targetElement.setAttribute('class', elementInfo);
            targetElement.setAttribute('variants', variantOpen);
          }
        }
      }
    }
  }

  return (
    <>
      <div className="font-[sans-serif] text-[#333] bg-slate-100 p-4 h-screen">
        <div className="">
          <motion.header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
            <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-slate-200 border-b bg-white bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to-90% h-[50px] sm:h-[50px] md:h-[50px] lg:h-[50px] xl:h-[50px]'>

              <div className="flex justify-between items-center w-full">
                {/* <div className="lg:cursor-pointer-hidden xl:cursor-pointer-hidden md:cursor-pointer-hidden sm:cursor-pointer-hidden lg:hidden xl:hidden md:hidden sm:hidden flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                  <svg className="w-6 h-6 text-slate-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                  </svg>
                </div> */}
                <div className="flex items-center">
                  <img src={Logo} className='h-[20px]' />
                  {/* <span className="font-bold text-3xl text-white hidden sm:block md:block lg:block xl:block">
                    COSMOHUB
                  </span> */}
                </div>

                <div className='text-sm flex items-center rounded transition-all'>
                  <div className='flex items-center space-x-6'>
                    <ul>
                      <li className="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                        <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                          viewBox="0 0 512 512">
                          <path
                            d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                            data-original="#000000" />
                        </motion.svg>
                        <motion.div animate={userDropdown === 'block' ? { opacity: 1, y: 0 } : { opacity: 1, y: "100%" }} className={userDropdown + " z-50 shadow-md bg-white p-4 w-[250px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                          <motion.h6 whileHover={{ scale: 1.1 }} className="font-semibold cursor-pointer hover:text-slate-400" onClick={() => {
                            navigate("/users",
                              {
                                state: {
                                  userid
                                }
                              }
                            );
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>

                            User Settings</motion.h6>
                          <hr className="w-43 h-1 mx-auto bg-gray-300 border-0 rounded my-2" />
                          <motion.h6 whileHover={{ scale: 1.1 }} className="font-semibold cursor-pointer hover:text-slate-400 mt-4" onClick={() => { setChangePassModal('block') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                            </svg>

                            Change Password</motion.h6>

                          <motion.h6 whileHover={{ scale: 1.1 }} className="font-semibold cursor-pointer hover:text-red-400 mt-2" onClick={handleLogOut}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 float-start">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                            </svg>

                            Logout
                          </motion.h6>



                        </motion.div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>
          </motion.header>
          <div className='justify-start text-sm mt-2 cursor-pointer hidden sm:flex md:flex lg:flex xl:flex text-gray-400' onClick={() => navigate("/landing")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current mr-2" viewBox="0 0 55.753 55.753">
                            <path
                                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                                data-original="#000000" />
                        </svg>
                        <p>back to the users page</p>
                    </div>
          <div className='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full mt-7'>

            <div className='flex items-center'>
              <div
                className=" border-2 bg-gray-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-400 mr-3">
                  <path
                    d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                  </path>
                </svg>
                <input type='text' value={user} onChange={handleSearchBar} placeholder='Search...' className="w-full outline-none bg-transparent text-black text-sm" />

              </div>
              <motion.button whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.5 }}
                type="button"
                onClick={handleAddModalOpen}
                className="h-[40px] w-[220px] sm:w-[240px] md:w-[200px] lg:w-[200px] xl:w-[200px] px-4 py-2.5 flex items-center text-[#fff] rounded-sm text-sm font-semibold outline-none bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 float-start mr-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>
                Add User
              </motion.button>
            </div>
          </div>
          {showModal ? (
            <>
              <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
              >
                <div className="flex relative w-auto my-6 mx-auto max-w-6xl">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        Users Contact Persons
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
          {/* <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Add User</h3>
                <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.3 }} onClick={handleAddModalClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                  viewBox="0 0 320.591 320.591">
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"></path>
                </motion.svg>
              </div>
              <div className="m-10">
                <form onSubmit={handleAddUser} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                  <div className={`${addErrorHandler} mt-2 bg-red-100 text-red-800 w-[360px] p-4 rounded-md relative`} role="alert">
                    <strong className="font-bold text-base">User Add Failed!</strong>
                    <span className="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">User name already exist.</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">User :</label>
                    <input
                      type="text"
                      // id="username"
                      name="username"
                      placeholder="Enter users name"
                      value={username}
                      required
                      autoComplete='off'
                      onChange={handleOnChange}
                      className={`px-2 py-2 w-full border-b-2 ${addErrorHandler === 'hidden' ? 'border-slate-700 focus:border-slate-700' : 'border-red-400 focus:border-red-400'}  outline-none text-sm bg-white`} />
                  </div>
                  <p className={addErrorHandler + ' text-xs flex flex-row-reverse text-red-400 p-0 m-0'}>User Name Already Exist</p>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Address :</label>
                    <input
                      type="text"
                      // id="useraddress"
                      name="useraddress"
                      placeholder="Enter users address"
                      value={useraddress}
                      required
                      autoComplete='off'
                      onChange={handleOnChange}
                      className="px-2 py-2 w-full border-b-2 focus:border-slate-700 outline-none text-sm bg-white" />
                  </div>
                  <motion.button whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} type="submit"
                    className="rounded-md px-6 py-2 w-full bg-slate-700 text-sm text-white hover:bg-slate-400 mx-auto block">Submit</motion.button>
                </form>
              </div>
            </div>
          </motion.div> */}
          {/* <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={isUserModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Update User</h3>
                <svg onClick={handleUpdateUserClose} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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
                    <label className="text-gray-400 w-36 text-sm">User :</label>
                    <input
                      type="text"
                      // id="username"
                      name="username"
                      placeholder="Enter users name"
                      value={username}
                      required
                      onChange={handleOnChange}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-36 text-sm">Address :</label>
                    <input
                      type="text"
                      // id="useraddress"
                      name="useraddress"
                      placeholder="Enter users address"
                      value={useraddress}
                      required
                      onChange={handleOnChange}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} type="submit"
                    className="rounded-md px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update</motion.button>
                </form>
              </div>
            </div>
          </motion.div> */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        className={isModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
                        <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                            <div className="flex items-center pb-3 border-b text-black">
                                <h3 className="text-xl font-bold flex-1">Add User</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                                    onClick={handleAddModalClose}
                                    viewBox="0 0 320.591 320.591">
                                    <path
                                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                        data-original="#000000"></path>
                                    <path
                                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                        data-original="#000000"></path>
                                </svg>
                            </div>

                            <form onSubmit={""} className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                                <div className="grid sm:grid-cols-2 gap-10">
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Employee No.</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='contactPerson'
                                            // value={contactPerson}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Position</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">

                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Firstname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            // value={nickname}
                                            autoComplete='off'
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Middlename</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Lastname</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Department</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Username</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Password</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="mb-9 relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Confirm Password</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            // value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    {/* <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            // value={department}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <path
                                                d="M20.48 8.301A9.217 9.217 0 0 1 21.25 12c0 5.105-4.145 9.25-9.25 9.25S2.75 17.105 2.75 12 6.895 2.75 12 2.75a.75.75 0 0 0 0-1.5C6.067 1.25 1.25 6.067 1.25 12S6.067 22.75 12 22.75 22.75 17.933 22.75 12c0-1.529-.32-2.983-.896-4.301a.75.75 0 0 0-1.374.602z"
                                                data-original="#000000" />
                                            <path
                                                d="M17 1.25a3.443 3.443 0 0 0-3.442 3.442c0 .594.269 1.317.685 2.023.835 1.421 2.227 2.815 2.227 2.815a.749.749 0 0 0 1.06 0s1.392-1.394 2.227-2.815c.416-.706.685-1.429.685-2.023 0-1.9-1.542-3.442-3.442-3.442zm0 1.5c1.072 0 1.942.87 1.942 1.942 0 .528-.393 1.177-.815 1.789A15.328 15.328 0 0 1 17 7.901c-.325-.366-.75-.874-1.127-1.42-.422-.612-.815-1.261-.815-1.789 0-1.072.87-1.942 1.942-1.942zM1.603 12.636l3.27 2.044c.596.372 1.285.57 1.987.57h.76c.657 0 1.281.287 1.709.786l1.051 1.227a2.25 2.25 0 0 1 .456 2.082l-.557 1.949a.75.75 0 0 0 1.442.412l.557-1.949a3.748 3.748 0 0 0-.759-3.47l-1.052-1.227a3.746 3.746 0 0 0-2.847-1.31h-.76c-.421 0-.834-.118-1.192-.342l-3.271-2.044a.75.75 0 1 0-.794 1.272z"
                                                data-original="#000000" />
                                            <path
                                                d="m5.329 4.335 1.596 3.192a2.748 2.748 0 0 0 1.757 1.429l1.758.465c.443.117.786.467.894.912l.753 3.087a2.75 2.75 0 0 0 1.146 1.637l.466.31a2.746 2.746 0 0 0 3.985-1.058l.575-1.151a1.25 1.25 0 0 1 .815-.653l2.791-.698a.75.75 0 0 0-.364-1.455l-2.791.697a2.752 2.752 0 0 0-1.792 1.438l-.576 1.151a1.246 1.246 0 0 1-1.811.481l-.466-.31a1.25 1.25 0 0 1-.521-.744l-.752-3.087a2.75 2.75 0 0 0-1.969-2.007l-1.758-.465a1.247 1.247 0 0 1-.798-.65L6.671 3.665a.75.75 0 1 0-1.342.67z"
                                                data-original="#000000" />
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 1</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name="contactNumber"
                                            // value={contactNumber}
                                            autoComplete='off'
                                            pattern='^[+]?[\d]+([\-][\d]+)*\d$'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 2</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            // value={contactNumber2}
                                            name='contactNumber2'
                                            autoComplete='off'
                                            // required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            // value={contactNumber3}
                                            autoComplete='off'
                                            // required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Email</label>
                                        <input type="email" placeholder="Enter email"
                                            onChange={handleOnChange}
                                            // value={emailAddress}
                                            name='emailAddress'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="#bbb" class="w-[16px] h-[16px] absolute right-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Remarks</label>
                                        <textarea placeholder="Enter Remarks"
                                            onChange={handleOnChange}
                                            // value={remarks}
                                            name='remarks'
                                            autoComplete='off'
                                            // required
                                            className="p-4 bg-white max-w-md mx-auto w-full block text-sm border mb-10 border-slate-300 outline-slate-700 rounded" rows="3"></textarea>
                                    </div> */}
                                </div>
                                <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.5}} type="submit"
                                    className="px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</motion.button>
                            </form>
                        </div>
                    </motion.div>
          <motion.div initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className={changePassModal + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
            <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
              <div className="flex items-center pb-3 border-b text-black">
                <h3 className="text-xl font-bold flex-1">Change Password</h3>
                <svg onClick={() => { setChangePassModal('hidden') }} xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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
                <form onSubmit={handleChangePassword} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                  <div className={`${changePassErrorHandler} mt-2 bg-red-100 text-red-800 w-[360px] p-4 rounded-md relative`} role="alert">
                    <strong className="font-bold text-base">Change Password Failed!</strong>
                    <span className="block text-sm sm:inline max-sm:mt-1 max-sm:ml-0 mx-4">Confirmed password doesnt match the new password.</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-44 text-sm">New Password :</label>
                    <input
                      type={passwordTypeNew}
                      id="newpassword"
                      name="newpassword"
                      placeholder="Enter new password"
                      value={newpassword}
                      required
                      onChange={handleOnChangePass}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                      <a className="font-bold text-neutral-800">
                        <motion.label whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} className="cursor-pointer" name="newpassword" onClick={handleShowPass} htmlFor="check">{showHideNew}</motion.label>
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="text-gray-400 w-44 text-sm">Confirm Password :</label>
                    <input
                      type={passwordType}
                      id="confirmpassword"
                      name="confirmpassword"
                      placeholder="Enter confirmed password"
                      value={confirmpassword}
                      required
                      onChange={handleOnChangePass}
                      autoComplete='off'
                      className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                    <div className="my-auto text-xs leading-6 text-right text-neutral-400">
                      <a className="font-bold text-neutral-800">
                        <motion.label whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} className="cursor-pointer" name="confirmpassword" onClick={handleShowPass} htmlFor="check">{showHide}</motion.label>
                      </a>
                    </div>
                  </div>

                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} type="submit"
                    className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update</motion.button>
                </form>
              </div>
            </div>
          </motion.div>
          {!loadingDone ? (
            <div className='flex items-start justify-center bg-slate-100 h-screen'>
              <ReactLoading type="cylon" color="#94a3b8" height={100} width={100} delay={800} />
            </div>
          ) : (
            <>
              <div className='flex items-center justify-center'>
                <div className='m-4 grid sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-3 w-full'>
                  {/* </header> */}

                  {foundUser && foundUser.length > 0 ? foundUser.map((userInfo, i) => {
                    return (
                      <motion.div whileHover={{ scale: 1.05}} initial={{ opacity: 0, x: "100%" }} whileInView={{ opacity: 1, x: 0 }} className="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-200 dark:border-gray-800 dark:bg-gray-900 shadow-lg" key={userInfo.EmployeeId}>
                        <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white dark:from-white dark:to-white blur-2xl opacity-25 dark:opacity-5 dark:group-hover:opacity-10 p-10"></div>
                        <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-md bg-slate-100 cursor-pointer" onClick={handleOpenKebab} id="menuOpen">
                          <motion.svg whileTap={{ scale: 0.5 }} whileHover={{ scale: 1.1 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" key={userInfo.EmployeeId} data-key={userInfo.EmployeeId}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                          </motion.svg>

                          <motion.div initial={{opacity: 0, y: "-100%"}} whileInView={{opacity: 1, y: 0}} name="kebabDropdown" id={userInfo.EmployeeId} className="hidden flex-col z-50 bg-slate-200 p-2 w-[100px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]">
                            <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.5}} onClick={handleUpdateUser} id={userInfo.EmployeeId} className="text-xs cursor-pointer hover:text-gray-400 rounded-sm flex items-start justify-start space-x-1 mb-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                              <span id={userInfo.EmployeeId} className='mt-0.5'>Edit</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1}} whileTap={{ scale: 0.5}} id={userInfo.EmployeeId} className="text-xs cursor-pointer hover:text-sky-400 rounded-sm flex items-start justify-start space-x-1" onClick={handleOpenUserInfo}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                              </svg>
                              <span id={userInfo.EmployeeId} className='mt-0.5'>Contacts</span>
                            </motion.button>
                          </motion.div>
                        </div>
                        <div className="relative">
                          <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                            <p className="text-gray-700 text-xl dark:text-gray-300">{userInfo.LNameFName}</p>
                            <p className="text-xs text-gray-700 dark:text-gray-300">{userInfo.UserRoleDesc}</p>
                          </div>
                          <div className="flex gap-3 -mb-8 py-4 border-t border-gray-200 dark:border-gray-800">
                          </div>
                        </div>
                      </motion.div>
                    )

                  }) :
                    <tr className='flex items-start justify-start hover:bg-blue-50 bg-slate-100 h-screen w-screen'>
                      <td className="px-2 py-2 text-sm">
                        No User Found.
                      </td>
                    </tr>
                  }

                  {/* <table className='min-w-full bg-white font-[sans-serif]'>
              <thead className="bg-gray-800 whitespace-nowrap">
                <tr>
                  <th className="w-full px-6 py-3 text-start font-semibold text-white text-lg">
                    User
                  </th>
                  <th className="w-full px-6 py-3 text-left text-sm font-semibold text-white">
                  </th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap divide-y divide-gray-200">

                    {foundUser && foundUser.length > 0 ? foundUser.map((userInfo, i) => {
                      return (
                        <tr className={i%2 === 0?'hover:bg-slate-200' : 'hover:bg-slate-200 bg-blue-50'} key={userInfo.Value} id="parentElement" data-key={userInfo.Value}>
                          
                          <td className="px-2 py-2 flex items-center justify-between">
                          <div className="px-2 py-2 text-md text-center">
                            {userInfo.Text}
                            </div>
                            <div className=''>
                            <button className="mr-4" title="UpdateUser" onClick={handleUpdateUser}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="float-start w-6 h-6 hover:stroke-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </button>
                            <button className="mr-4" title="OpenUser" onClick={handleOpenUserInfo}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#545457" className="float-start w-6 h-6 hover:stroke-slate-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                              </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )

                    }) :
                      <tr className='flex items-start justify-start hover:bg-blue-50 bg-slate-100 h-screen w-screen'>
                        <td className="px-2 py-2 text-sm">
                          No User Found.
                        </td>
                      </tr>
                    }
                  
              </tbody>
            </table> */}

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default UserPage