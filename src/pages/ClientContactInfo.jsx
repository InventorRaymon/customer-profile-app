import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../routes/urlHandler';
import Swal from 'sweetalert2';

const ClientContactInfo = () => {
    const state = useLocation().state;
    const navigate = useNavigate();
    const clientId = state.clientId;
    // const clientId = "1234";

    const token = localStorage.getItem("token");
    const [contactsData, setContactsData] = useState([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState('hidden');
    const [onEditMode, setOnEditMode] = useState('hidden');
    const [isEdit, setIsEdit] = useState(false);
      const [initialData, setInitialData] = useState("");
  const [contact, setContact] = useState('');
  const [foundContact, setFoundContact] = useState(contactsData);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userDropdown, setUserDropdown] = useState('hidden');
    const [inputValue, setInputValue] = useState({
        contactPerson: "",
        position: "",
        department: "",
        emailAddress: "",
        nickname: "",
        birthdate: "",
        contactNumber: "",
        contactNumber2: "",
        contactNumber3: "",
        profileImage: "",
        clientId: clientId
    });

    const {
        contactPerson,
        position,
        department,
        emailAddress,
        nickname,
        birthdate,
        contactNumber,
        contactNumber2,
        contactNumber3,
        profileImage
    } = inputValue;


    const getContactList = async () => {
        try {
            const { data } = await axios.get(
                `${base_url}/GetAllCustomerList/${clientId}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
            );
            const { CustomerList, ReturnMsg } = data;
            setContactsData(CustomerList);
            if (ReturnMsg === "Success") {
                setContactsData(CustomerList);
            } else {
                console.log(ReturnMsg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getContactList();
        if(initialData == ""){
            setFoundContact(contactsData)
          }
    }, [contactsData]);

    const handleAddContactOpen = () => {
        setIsContactModalOpen("block");
        setSelectedImage(null);
        setInputValue({
            ...inputValue,
            contactPerson: "",
            position: "",
            department: "",
            emailAddress: "",
            nickname: "",
            birthdate: "",
            contactNumber: "",
            contactNumber2: "",
            contactNumber3: "",
            profileImage: ""
        });
    }

    const handlContactMocalClose = () => {
        setIsContactModalOpen("hidden");
    }

    const handleFileRead = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertBase64(file);
        setSelectedImage(base64);
        setInputValue({ ...inputValue, "profileImage": base64.toString() })

    }

    const handleOnChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value,
        });
    };


    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const handleEditMocalClose = () => {
        setOnEditMode('hidden');
    }



    const handleAddContact = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${base_url}/PostCustomer`,
                {
                    ...inputValue
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
                    title: "Contact Added",
                    text: "Successfuly added a new contact!",
                    confirmButtonColor: "#334155",
                    color: "#334155",
                }).then(() => {
                    handlContactMocalClose();
                })

            } else {
            }
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            contactPerson: "",
            position: "",
            department: "",
            emailAddress: "",
            nickname: "",
            birthdate: "",
            contactNumber: "",
            contactNumber2: "",
            contactNumber3: "",
            profileImage: ""
        });
    }

    const handleEditContact = async (e) => {
        e.preventDefault()

        try {
            const { data } = await axios.post(
                `${base_url}/PostCustomer`,
                {
                    ...inputValue
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
                    title: "Contact Updated",
                    text: "Successfuly updated the contact!",
                    confirmButtonColor: "#334155",
                    color: "#334155",
                }).then(() => {
                    setInputValue({
                        ...inputValue,
                        Id: "",
                        id: "",
                        contactPerson: "",
                        position: "",
                        department: "",
                        emailAddress: "",
                        nickname: "",
                        birthdate: "",
                        contactNumber: "",
                        contactNumber2: "",
                        contactNumber3: "",
                        profileImage: ""
                    })
                    handleEditMocalClose();
                })
            } else {
            }
        } catch (error) {
            console.log(error);
        }
        setInputValue({
            ...inputValue,
            contactPerson: "",
            position: "",
            department: "",
            emailAddress: "",
            nickname: "",
            birthdate: "",
            contactNumber: "",
            contactNumber2: "",
            contactNumber3: "",
            profileImage: ""
        });
    }

    const handleDeleteContact = async (e) => {
        const parentElement = e.target.closest("#parentElement");
        const contactId = parentElement.getAttribute('data-key');
        try {
            const { data } = await axios.post(
                `${base_url}/DeleteCustomer`,
                {
                    "Id": contactId
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
                    title: "Contact Deleted",
                    text: "Successfuly deleted contact!",
                    confirmButtonColor: "#334155",
                    color: "#334155",
                }).then(() => {
                    navigate("/clientcontacts",
                        {
                            state: { clientId }
                        }
                    );
                })
            } else {
                // handleError(message);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleEditMode = async (e) => {
        e.preventDefault();
        setOnEditMode('block');
        setIsEdit(true);
        const parentElement = e.target.closest("#parentElement");
        const contactId = parentElement.getAttribute('data-key');

        for(let index in contactsData) {
            let contactInfo = contactsData[index];
            if (contactInfo.Id === contactId) {
                setSelectedImage(contactInfo.ProfileImage)
                let formattedBirthday = "";
                if (contactInfo.Birthday !== undefined) {
                    const birthdayInfo = contactInfo.Birthday;
                    const [month, day, year] = birthdayInfo.split("/");
                    formattedBirthday = year + "-" + month + "-" + day;
                } else {
                    if (contactInfo.birthdate !== undefined) {
                        const birthdayInfo = contactInfo.birthdate;
                        const [month, day, year] = birthdayInfo.split("/");
                        formattedBirthday = year + "-" + month + "-" + day;
                    }
                }
                setInputValue({
                    ...inputValue,
                    Id: contactId,
                    id: contactId,
                    contactPerson: contactInfo.ContactPerson,
                    position: contactInfo.Position,
                    department: contactInfo.Department,
                    emailAddress: contactInfo.EmailAddress,
                    nickname: contactInfo.Nickname,
                    birthdate: formattedBirthday,
                    contactNumber: contactInfo.ContactNumber,
                    contactNumber2: contactInfo.ContactNumber2,
                    contactNumber3: contactInfo.ContactNumber3,
                    profileImage: contactInfo.ProfileImage
                });
            }
        }
    }

    const handleOpenInfo = (e) => {
        const parentElement = e.target.closest("#parentElement");
        const contactId = parentElement.getAttribute('data-key');
        const allElements = document.getElementsByName("hide-show");
        for(let index in allElements) {
            if (allElements[index].id === contactId) {
                if (allElements[index].getAttribute('class') !== null) {
                    allElements[index].removeAttribute("class")
                } else {
                    allElements[index].setAttribute('class', 'mt-4 hidden')
                }
            } else {
                if (allElements[index].id !== undefined) {
                    allElements[index].setAttribute('class', 'mt-4 hidden')
                }
            }
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
        if (searchInput !== '' && searchInput !== undefined) {
          const results = contactsData.filter((user) => {
                if(user.ContactPerson !== undefined && user.ContactPerson !== ""){
                    return user.ContactPerson.toLowerCase().startsWith(searchInput.toLowerCase());
                }
          });
          setFoundContact(results);
        } else {
          setFoundContact(contactsData);
        }
    
        setContact(searchInput);
      }


    return (
        <>
            <div className="font-[sans-serif] text-[#333] bg-gray-50 p-4">
                <div className="max-w-5xl max-sm:max-w-sm mx-auto">
                    {/* <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                        <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[60px] sm:h-[60px] md:h-[560px] lg:h-[560px] xl:h-[80px]'>
                        <div className="flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                    </svg>
                                </div>
                            <div className="flex-col lg:flex-row items-center justify-between w-full hidden sm:hidden md:hidden lg:flex xl:flex" >
                                <div className="cursor-pointer flex items-center mb-2 lg:mb-0" onClick={() => navigate("/landing")}>
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" className='shrink w-55 h-14 mr-4' />
                                    <span className="font-bold text-3xl text-white max-md:mt-10">
                                        COSMOHUB
                                    </span>
                                </div>
                                <h2 className="text-2xl font-semibold flex-center text-white mb-2 lg:mb-0">Client Contacts</h2>
                                <a href="javascript:void(0)"
                                    onClick={handleLogOut}
                                    className="cursor-pointer border-solid border-2 text-white hover:text-slate-600 text-sm flex items-center hover:bg-blue-50 rounded px-2 py-2 transition-all">
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
                    </header> */}
                    {/* <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                        <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[60px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[80px]'>
                            <div className="lg:hidden flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                </svg>
                            </div>
                            <div className="flex flex-row-reverse lg:flex-row items-center justify-between w-full" >
                                <div className="items-center mb-2 lg:mb-0 hidden sm:hidden md:hidden lg:flex xl:flex" >
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" className='shrink w-55 h-14 mr-4' />
                                    <span className="font-bold text-3xl text-white max-md:mt-10">
                                        COSMOHUB
                                    </span>
                                </div>
                                <div className='text-sm flex items-center rounded transition-all'>
                                    <div className='flex items-center max-sm:ml-auto space-x-6'>
                                        <ul>
                                            <li
                                                className="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                                                    viewBox="0 0 512 512">
                                                    <path
                                                        d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                                        data-original="#000000" />
                                                </svg>
                                                <div className={userDropdown + " z-50 shadow-md bg-white p-4 w-[180px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400">User Settings</h6>
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400" onClick={handleLogOut}>Logout</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </header> */}
                    <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                        <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[60px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[80px]'>

                            <div className="flex justify-between items-center w-full">
                                <div className="lg:cursor-pointer-hidden xl:cursor-pointer-hidden md:cursor-pointer-hidden sm:cursor-pointer-hidden lg:hidden xl:hidden md:hidden sm:hidden flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                    </svg>
                                </div>
                                <div className="flex items-center">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" className='shrink w-55 h-14 mr-4 hidden sm:hidden md:block lg:block xl:block' />
                                    <span className="font-bold text-3xl text-white hidden sm:block md:block lg:block xl:block">
                                        COSMOHUB
                                    </span>
                                </div>
                                <div className='text-sm flex items-center rounded transition-all'>
                                    <div className='flex items-center space-x-6'>
                                        <ul>
                                            <li className="relative px-1 after:absolute after:bg-transparent after:w-full after:h-[2px] after:block after:top-8 after:left-0 after:transition-all after:duration-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer xl:hover:fill-slate-500 lg:hover:fill-slate-500" fill="white" onClick={handleUserDropdown}
                                                    viewBox="0 0 512 512">
                                                    <path
                                                        d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                                        data-original="#000000" />
                                                </svg>
                                                <div className={userDropdown + " z-50 shadow-md bg-white p-4 w-[180px] sm:min-w-[140px] max-sm:min-w-[200px] absolute right-0 top-10 rounded-md"}>
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400">User Settings</h6>
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400" onClick={handleLogOut}>Logout</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </header>
                    <div className='justify-end text-sm mt-2 cursor-pointer hidden sm:flex md:flex lg:flex xl:flex' onClick={() => navigate("/landing")}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                        <p>back to the clients page</p>
                    </div>
                    <div className='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full'>

            <div className='flex items-center'>
              <div
                  className=" border-2 bg-gray-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-400 mr-3">
                    <path
                      d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                    </path>
                  </svg>
                  <input type='text' value={contact} onChange={handleSearchBar} placeholder='Search...' className="w-full outline-none bg-transparent text-black text-sm" />        
                
                </div>
              <button type="button"
                onClick={handleAddContactOpen}
                className="h-[40px] w-[220px] sm:w-[240px] md:w-[200px] lg:w-[200px] xl:w-[200px] px-4 py-2.5 flex items-center text-[#fff] rounded-sm text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" className="mr-2" viewBox="0 0 6.35 6.35">
                  <path fillRule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paintOrder="stroke fill markers" />
                </svg>
                Add Client
              </button>
            </div>
          </div>

                    {/* <div className="font-[sans-serif] text-[#333] bg-gray-50 p-2">
                        <div className="max-w-5xl max-sm:max-w-sm mx-auto">
                            <button type="button"
                                onClick={handleAddContactOpen}
                                className="m-10 px-4 py-2.5 flex items-center text-[#fff] rounded-full text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-slate-700 active:bg-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" className="mr-2" viewBox="0 0 6.35 6.35">
                                    <path fillRule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paintOrder="stroke fill markers" />
                                </svg>
                                Add Contact
                            </button>

                            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-8 text-center mt-12">

                                {contactsData && contactsData.map((contactInfo) => {
                                    // console.log(contactInfo)
                                    let formattedBirthday;
                                    if (contactInfo !== undefined) {
                                        if (contactInfo.Birthday !== undefined) {
                                            const birthdayInfo = contactInfo.Birthday;
                                            const [month, day, year] = birthdayInfo.split("/");
                                            formattedBirthday = year + "-" + month + "-" + day;
                                        } else {
                                            if (contactInfo.birthdate !== undefined) {
                                                const birthdayInfo = contactInfo.birthdate;
                                                const [month, day, year] = birthdayInfo.split("/");
                                                formattedBirthday = year + "-" + month + "-" + day;
                                            }
                                        }
                                    }

                                    return (
                                        <>
                                            <div
                                                key={contactInfo.Id} data-key={contactInfo.Id} id="parentElement"
                                                onClick={handleOpenInfo}
                                                className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg hover:scale-105 transition-all duration-500 cursor-pointer">
                                                <div className="mt-2 mb-2 h-[220px]">
                                                    <div className='shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]'>
                                                        <div className="bg-white py-4 px-2 rounded-md ">

                                                            <img src={contactInfo.ProfileImage} alt='Img Error' className="w-36 h-36 rounded-md inline-block border-solid border-2 border-slate-400" />
                                                            <p className="text-[15px] text-[#333] font-bold">{contactInfo.ContactPerson}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{contactInfo.EmailAddress}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{contactInfo.ContactNumber ? contactInfo.ContactNumber : contactInfo.ContactNumber2 ? contactInfo.ContactNumber2 : contactInfo.ContactNumber3 ? contactInfo.ContactNumber3 : "No Added Contact No."}</p>
                                                        
                                                            <div name="hide-show" id={contactInfo.Id} className="mt-4 hidden">

                                                                <form className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                                                                    <div className="grid sm:grid-cols-2 gap-10">
                                                                        <div className="relative flex items-center sm:col-span-2">
                                                                            <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                                Fullname</label>
                                                                            <input type="text" placeholder={contactInfo.ContactPerson}
                                                                                onChange={handleOnChange}
                                                                                name='contactPerson'
                                                                                value={contactInfo.ContactPerson}
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                                                                viewBox="0 0 24 24">
                                                                                <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                                                <path
                                                                                    d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                                                    data-original="#000000"></path>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="relative flex items-center ">

                                                                            <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                                Nickname</label>
                                                                            <input type="text" placeholder={contactInfo.Nickname}
                                                                                onChange={handleOnChange}
                                                                                name='nickname'
                                                                                value={contactInfo.Nickname}
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                                                            <input type="text" placeholder={contactInfo.Position}
                                                                                name='position'
                                                                                value={contactInfo.Position}
                                                                                onChange={handleOnChange}
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                                                                Birth Date</label>

                                                                            <input
                                                                                type="date"
                                                                                // placeholder="MM-dd-yyyy"
                                                                                // format="MM-dd-yyyy"
                                                                                name='birthdate'
                                                                                disabled
                                                                                value={formattedBirthday}
                                                                                onChange={handleOnChange}
                                                                                className="px-3 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        </div>
                                                                        <div className="relative flex items-center">
                                                                            <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                                                            <input type="text" placeholder={contactInfo.Department}
                                                                                name='department'
                                                                                value={contactInfo.Department}
                                                                                onChange={handleOnChange}
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                                                        <div className="relative flex items-center sm:col-span-2">
                                                                            <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                                Contact No.</label>
                                                                            <input type="text" placeholder={contactInfo.ContactNumber}
                                                                                onChange={handleOnChange}
                                                                                name="contactNumber"
                                                                                value={`${contactInfo.ContactNumber}, ${contactInfo.ContactNumber2}, ${contactInfo.ContactNumber3}`}
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-1 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        </div>
                                                                        <div className="relative flex items-center sm:col-span-2">
                                                                            <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Email</label>
                                                                            <input type="email" placeholder={contactInfo.EmailAddress}
                                                                                onChange={handleOnChange}
                                                                                value={contactInfo.EmailAddress}
                                                                                name='emailAddress'
                                                                                disabled
                                                                                autoComplete='off'
                                                                                className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                                                                viewBox="0 0 682.667 682.667">
                                                                                <defs>
                                                                                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                                                        <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                                                    </clipPath>
                                                                                </defs>
                                                                                <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                                                    <path fill="none" strokeMiterlimit="10" strokeWidth="40"
                                                                                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                                                        data-original="#000000"></path>
                                                                                    <path
                                                                                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                                                        data-original="#000000"></path>
                                                                                </g>
                                                                            </svg>

                                                                        </div>


                                                                    </div>
                                                                    <div className="mt-4 font-[sans-serif] w-max mx-auto bg-gray-100 border divide-x divide-white flex rounded overflow-hidden">
                                                                        <button type="button"
                                                                            onClick={handleEditMode}
                                                                            className="px-4 py-2.5 flex items-center text-[#333] text-sm font-semibold outline-none hover:bg-gray-300 transition-all">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" className="mr-2" viewBox="0 0 24 24">
                                                                                <path d="m20 8.6-8.38 8.38c-.29.29-.67.47-1.08.51l-2.93.27H7.5c-.33 0-.65-.13-.88-.37-.26-.26-.39-.63-.36-1l.27-2.93c.04-.41.22-.79.51-1.08L15.4 4zm1.94-5.83-.71-.71a2.758 2.758 0 0 0-3.89 0l-.88.88 4.6 4.6.88-.88a2.732 2.732 0 0 0 0-3.88zm-1.19 16.24V13.2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v5.81c0 1.24-1.01 2.25-2.25 2.25H5c-1.24 0-2.25-1.01-2.25-2.25V7c0-1.24 1.01-2.25 2.25-2.25h5.81c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H5C2.93 3.25 1.25 4.93 1.25 7v12c0 2.07 1.68 3.75 3.75 3.75h12c2.07 0 3.75-1.68 3.75-3.75z" data-original="#000000" />
                                                                            </svg>
                                                                            Edit
                                                                        </button>
                                                                        <button type="button"
                                                                            onClick={handleDeleteContact}
                                                                            className="px-4 py-2.5 flex items-center text-[#333] text-sm font-semibold outline-none hover:bg-gray-300 transition-all">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" fill="#000000" viewBox="0 0 320.591 320.591">
                                                                                <path
                                                                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                                                                    data-original="#000000" />
                                                                                <path
                                                                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                                                                    data-original="#000000" />
                                                                            </svg>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </>
                                    );
                                })}
                            </div>

                        </div>
                    </div> */}
                    <div className="rounded-lg font-[sans-serif] text-[#333] bg-slate-50 p-2 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] mt-4">
                        <div className="max-w-5xl max-sm:max-w-sm mx-auto">
                            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-8 text-center mt-12 ">
                                {foundContact && foundContact.map((contactInfo) => {
                                    let formattedBirthday;
                                    if (contactInfo !== undefined) {
                                        if (contactInfo.Birthday !== undefined) {
                                            const birthdayInfo = contactInfo.Birthday;
                                            const [month, day, year] = birthdayInfo.split("/");
                                            formattedBirthday = year + "-" + month + "-" + day;
                                        } else {
                                            if (contactInfo.birthdate !== undefined) {
                                                const birthdayInfo = contactInfo.birthdate;
                                                const [month, day, year] = birthdayInfo.split("/");
                                                formattedBirthday = year + "-" + month + "-" + day;
                                            }
                                        }
                                    }

                                    return (
                                        <div
                                            key={contactInfo.Id} data-key={contactInfo.Id} id="parentElement"
                                            onClick={handleOpenInfo}
                                            className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg hover:scale-105 transition-all duration-500 cursor-pointer">
                                            <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start">
                                                <div className="mt-2 mb-2 lg:mb-0 lg:mr-4 h-[220px]">
                                                    <div className='shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]'>
                                                        <div className="bg-white py-4 px-2 rounded-md">
                                                            <img src={contactInfo.ProfileImage} alt='Img Error' className="w-36 h-36 rounded-md inline-block border-solid border-2 border-slate-400" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <p className="text-[15px] text-[#333] font-bold">{contactInfo.ContactPerson}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{contactInfo.EmailAddress}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{contactInfo.ContactNumber ? contactInfo.ContactNumber : contactInfo.ContactNumber2 ? contactInfo.ContactNumber2 : contactInfo.ContactNumber3 ? contactInfo.ContactNumber3 : "No Added Contact No."}</p>
                                                </div>
                                            </div>
                                            {/* Additional content */}
                                            <div name="hide-show" id={contactInfo.Id} className="mt-4 hidden">
                                                {/* Your form content */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div
                        className={isContactModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
                        <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                            <div className="flex items-center pb-3 border-b text-black">
                                <h3 className="text-xl font-bold flex-1">Add Contact</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                                    onClick={handlContactMocalClose}
                                    viewBox="0 0 320.591 320.591">
                                    <path
                                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                        data-original="#000000"></path>
                                    <path
                                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                        data-original="#000000"></path>
                                </svg>
                            </div>

                            <form onSubmit={handleAddContact} className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                                {selectedImage && (
                                    <div className='flex flex-col items-center bg-white py-4 px-2 rounded-md hover:scale-110 transition-all duration-500'>
                                        <img
                                            alt="not found"
                                            width={"250px"}
                                            src={selectedImage}
                                            className='w-36 h-36 rounded-sm inline-block'
                                        />
                                        <button className='mt-2 hover:text-red-500' onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}


                                <div className="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        accept="image/png, image/gif, image/jpeg"
                                        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-10">
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Fullname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='contactPerson'
                                            value={contactPerson}
                                            autoComplete='off'
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
                                            autoComplete='off'
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            name='birthdate'
                                            value={birthdate}
                                            onChange={handleOnChange}
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={contactNumber}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={contactNumber2}
                                            name='contactNumber2'
                                            autoComplete='off'
                                            // required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
                                            autoComplete='off'
                                            // required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={emailAddress}
                                            name='emailAddress'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 682.667 682.667">
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                </clipPath>
                                            </defs>
                                            <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                <path fill="none" strokeMiterlimit="10" strokeWidth="40"
                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                    data-original="#000000"></path>
                                                <path
                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                    data-original="#000000"></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <button type="submit"
                                    className="mt-8 px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
                            </form>
                        </div>
                    </div>
                    <div
                        className={onEditMode + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
                        <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                            <div className="flex items-center pb-3 border-b text-black">
                                <h3 className="text-xl font-bold flex-1">Edit Contact</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
                                    onClick={handleEditMocalClose}
                                    viewBox="0 0 320.591 320.591">
                                    <path
                                        d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                        data-original="#000000"></path>
                                    <path
                                        d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                        data-original="#000000"></path>
                                </svg>
                            </div>

                            <div className="font-[sans-serif]">
                            </div>
                            <form onSubmit={handleEditContact} className="font-[sans-serif] m-6 max-w-4xl mx-auto">
                                {selectedImage && (
                                    <div className='flex flex-col items-center bg-white py-4 px-2 rounded-md hover:scale-110 transition-all duration-500'>
                                        <img
                                            alt="not found"
                                            width={"250px"}
                                            src={selectedImage}
                                            className='w-36 h-36 rounded-sm inline-block'
                                        />
                                        <button className='mt-2 hover:text-red-500' onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}
                                <div className="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        accept="image/png, image/gif, image/jpeg"
                                        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                                    <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-10">
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Fullname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='contactPerson'
                                            value={contactPerson}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={position}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            // placeholder="MM-dd-yyyy"
                                            // format="MM-dd-yyyy"
                                            name='birthdate'
                                            value={birthdate}
                                            onChange={handleOnChange}
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                    viewBox="0 0 24 24">
                                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                    <path
                                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                        data-original="#000000"></path>
                                </svg> */}
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
                                            onChange={handleOnChange}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={contactNumber}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={contactNumber2}
                                            name='contactNumber2'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
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
                                            value={emailAddress}
                                            name='emailAddress'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 682.667 682.667">
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                </clipPath>
                                            </defs>
                                            <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                <path fill="none" strokeMiterlimit="10" strokeWidth="40"
                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                    data-original="#000000"></path>
                                                <path
                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                    data-original="#000000"></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <button type="submit"
                                    className="mt-8 px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
                            </form>
                        </div>
                    </div>
                    {/* <footer className="bg-gray-100 font-[sans-serif]">
    <div className="py-8 px-4 sm:px-12">
        <p className='text-center text-gray-700 text-base'>Copyright © 2024 Cosmotech All Rights Reserved.</p>
    </div>
</footer> */}
                </div>
            </div>
        </>
    )
}

export default ClientContactInfo