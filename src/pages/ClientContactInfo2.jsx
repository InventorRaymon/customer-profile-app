import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { base_url } from '../routes/urlHandler';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import Resizer from 'react-image-file-resizer';
import Logo from '../images/logo.png'

const ClientContactInfo = () => {
    const state = useLocation().state;
    const navigate = useNavigate();
    const clientId = state.clientId;
    const token = localStorage.getItem("token");
    const [contactsData, setContactsData] = useState([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState('hidden');
    const [onEditMode, setOnEditMode] = useState('hidden');
    const [isEdit, setIsEdit] = useState(false);
    const [initialData, setInitialData] = useState("");
    const [contact, setContact] = useState('');
    const [kebabDropdown, setKebabDropdown] = useState('hidden');
    const [foundContact, setFoundContact] = useState(contactsData);
    const [selectedImage, setSelectedImage] = useState(null);
    const [userDropdown, setUserDropdown] = useState('hidden');
    const [changePassModal, setChangePassModal] = useState('hidden');
    const [passwordType, setPasswordType] = useState('password');
    const [showHide, setShowHide] = useState("SHOW");
    const [passwordTypeNew, setPasswordTypeNew] = useState('password');
    const [showHideNew, setShowHideNew] = useState("SHOW");
    const [changePassErrorHandler, setChangePassErrorHandler] = useState('hidden');
    const [contactHistory, setContactHistory] = useState('');
    const [loadingDone, setLoadingDone] = useState(undefined);
    const [resizeImage, setResizeImage] = useState(undefined);

    const [changepassInput, setChangepassInput] = useState({
        newpassword: "",
        confirmpassword: ""
    })

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
        remarks: "",
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
        profileImage,
        remarks
    } = inputValue;

    const { newpassword, confirmpassword } = changepassInput;

    const dummyArray = [
        {
            ContactPerson: "Raymon",
            Position: "Raymon",
            Department: "Raymon",
            EmailAddress: "Raymon",
            Nickname: "Raymon",
            Birthdate: "",
            ContactNumber: "099664268092",
            ContactNumber2: "099664268092",
            ContactNumber3: "099664268092",
            ProfileImage: "Raymon",
            ClientId: clientId
        },
        {
            ContactPerson: "Raymon",
            Position: "Raymon",
            Department: "Raymon",
            EmailAddress: "Raymon",
            Nickname: "Raymon",
            Birthdate: "Raymon",
            ContactNumber: "099664268092",
            ContactNumber2: "099664268092",
            ContactNumber3: "099664268092",
            ProfileImage: "Raymon",
            ClientId: clientId
        },
        {
            ContactPerson: "Raymon",
            Position: "Raymon",
            Department: "Raymon",
            EmailAddress: "Raymon",
            Nickname: "Raymon",
            Birthdate: "Raymon",
            ContactNumber: "099664268092",
            ContactNumber2: "099664268092",
            ContactNumber3: "099664268092",
            ProfileImage: "Raymon",
            ClientId: clientId
        }
    ]

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
                setLoadingDone(true);
            } else {
                console.log(ReturnMsg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        setTimeout(() => {
            getContactList();
        }, 2000)

        if (initialData == "") {
            setFoundContact(contactsData)
        }
        //   setFoundContact(dummyArray)
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

    const handleOnChangePass = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setChangepassInput({
            ...changepassInput,
            [name]: value,
        });
    };

    const handlContactMocalClose = () => {
        setIsContactModalOpen("hidden");
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
                    setChangepassInput({
                        ...changepassInput,
                        newpassword: "",
                        confirmpassword: ""
                    })
                    setChangePassErrorHandler('hidden')
                })
            } else {
                setChangePassErrorHandler('block')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileRead = async (e) => {
        const file = e.target.files[0];
        Resizer.imageFileResizer(
            file,
            150,
            150,
            'JPEG',
            100,
            0,
            (uri) => {
                setResizeImage(uri)
            },
            'base64',
        );
        const removeDataInfo = 'data:image/jpeg;base64,';
        if (removeDataInfo !== undefined && removeDataInfo !== null) {
            const newBase64 = resizeImage.replace(removeDataInfo, '');
            setSelectedImage(newBase64);
            setInputValue({ ...inputValue, "profileImage": newBase64.toString() })
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
                }).then((confirmMsg) => {
                    if (confirmMsg.isConfirmed) {
                        handlContactMocalClose();
                        navigate("/clientcontacts",
                            {
                                state: { clientId }
                            }
                        );
                    }
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
            profileImage: "",
            remarks: ""
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
                    navigate("/clientcontacts",
                        {
                            state: { clientId }
                        }
                    );
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
            profileImage: "",
            remarks: ""
        });
    }

    const handleViewHistory = async (e) => {
        e.preventDefault();
        const contactId = e.target.id;
        const { data } = await axios.get(
            `${base_url}/GetHistory/${contactId}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        );
        const { ReturnMsg, HistoryList } = data;
        if (ReturnMsg === "Success") {
            setContactHistory(HistoryList);
            const allElements = document.getElementsByName("historyDropdown");
            for (let index in allElements) {
                const targetElement = allElements[index];
                if (targetElement.id !== undefined && targetElement.id !== null) {
                    if (contactId == targetElement.id) {
                        const elementInfo = "flex flex-col p-4 z-50 bg-slate-100 p-2 w-[220px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                        const elementHidden = "hidden flex-col z-50 bg-slate-100 p-2 w-[150px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                        if (elementInfo === targetElement.className) {
                            targetElement.setAttribute('class', elementHidden);
                        } else {
                            targetElement.setAttribute('class', elementInfo);
                        }
                    }
                }

            }
        }
    }

    const handleDeleteContact = async (e) => {
        const contactId = e.target.id;
        closeDropdown(contactId);
        Swal.fire({
            title: "Remove Contact",
            text: "Are you sure you want to delete this contact?",
            confirmButtonColor: "#334155",
            showCancelButton: true,
            color: "#334155",
        }).then(async (confirmMsg) => {
            if (confirmMsg.isConfirmed == true) {
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
                }
            }

        })
    }


    const handleEditMode = async (e) => {
        e.preventDefault();
        setOnEditMode('block');
        const contactId = e.target.id;
        const allElements = document.getElementsByName("kebabDropdown");
        for (let index in allElements) {
            const targetElement = allElements[index];
            if (targetElement.id !== undefined && targetElement.id !== null) {
                if (contactId == targetElement.id) {
                    const elementHidden = "hidden flex-col z-50 bg-slate-200 p-2 w-[170px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                    targetElement.setAttribute('class', elementHidden);
                }
            }
        }
        closeDropdown(contactId);
        for (let index in contactsData) {
            let contactInfo = contactsData[index];
            if (contactInfo.Id === contactId) {
                setSelectedImage(contactInfo.ProfileImage)
                let formattedBirthday = "";
                if (contactInfo.Birthday !== undefined && contactInfo.Birthday !== null && contactInfo.Birthday !== "") {
                    const birthdayInfo = contactInfo.Birthday;
                    const [month, day, year] = birthdayInfo.split("/");
                    formattedBirthday = year + "-" + month + "-" + day;
                } else {
                    if (contactInfo.birthdate !== undefined && contactInfo.Birthday !== null && contactInfo.Birthday !== "") {
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
                    profileImage: contactInfo.ProfileImage,
                    remarks: contactInfo.Remarks
                });
            }
        }
    }

    const handleOpenInfo = (e) => {
        const parentElement = e.target.closest("#menuOpen");
        const contactId = parentElement.getAttribute('data-key');
        const allElements = document.getElementsByName("hide-show");
        for (let index in allElements) {
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

    const handleOpenKebab = (e) => {
        const contactId = e.target.getAttribute('data-key');
        const allElements = document.getElementsByName("kebabDropdown");
        for (let index in allElements) {
            const targetElement = allElements[index];
            if (targetElement.id !== undefined && targetElement.id !== null) {
                if (contactId == targetElement.id) {
                    const elementInfo = "flex flex-col p-4 z-50 bg-slate-100 p-2 w-[150px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                    const elementHidden = "hidden flex-col z-50 bg-slate-100 p-2 w-[150px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                    if (elementInfo === targetElement.className) {
                        targetElement.setAttribute('class', elementHidden);
                    } else {
                        targetElement.setAttribute('class', elementInfo);
                    }
                }
            }

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
        if (searchInput !== '' && searchInput !== undefined) {
            const results = contactsData.filter((user) => {
                if (user.ContactPerson !== undefined && user.ContactPerson !== "") {
                    return user.ContactPerson.toLowerCase().startsWith(searchInput.toLowerCase());
                }
            });
            setFoundContact(results);
        } else {
            setFoundContact(contactsData);
        }

        setContact(searchInput);
    }

    const closeDropdown = ({ contactId }) => {
        const allElements = document.getElementsByName("kebabDropdown");
        for (let index in allElements) {
            const targetElement = allElements[index];
            if (targetElement.id !== undefined && targetElement.id !== null) {
                const elementHidden = "hidden flex-col z-50 bg-slate-200 p-2 w-[170px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]";
                if (contactId == targetElement.id) {
                    targetElement.setAttribute('class', elementHidden);
                } else {
                    targetElement.setAttribute('class', elementHidden);
                }
            }
        }
    }

    return (
        <>
            <div className="font-[sans-serif] text-[#333] bg-slate-50 p-4">
                <div className="max-w-5xl max-sm:max-w-sm mx-auto">
                    <header className='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                        <section className='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-slate-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90% h-[60px] sm:h-[60px] md:h-[80px] lg:h-[80px] xl:h-[80px]'>

                            <div className="flex justify-between items-center w-full">
                                <div className="lg:cursor-pointer-hidden xl:cursor-pointer-hidden md:cursor-pointer-hidden sm:cursor-pointer-hidden lg:hidden xl:hidden md:hidden sm:hidden flex items-center h-[35px] cursor-pointer" onClick={() => navigate("/landing")} >
                                    <svg className="w-6 h-6 text-slate-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                    </svg>
                                </div>
                                <div className="flex items-center">
                                    <img src={Logo} className='h-[30px] max-sm:hidden' />
                                    {/* <span className="font-bold text-3xl text-white hidden sm:block md:block lg:block xl:block">
                                        COSMOHUB
                                    </span> */}
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
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400" onClick={() => {
                                                        navigate("/users",
                                                            {
                                                                state: {
                                                                    clientId
                                                                }
                                                            }
                                                        );
                                                    }}>User Settings</h6>
                                                    <hr className="w-43 h-1 mx-auto bg-gray-300 border-0 rounded my-2 dark:bg-gray-700" />
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400" onClick={() => { setChangePassModal('block') }}>Change Password</h6>
                                                    <h6 className="font-semibold cursor-pointer hover:text-slate-400" onClick={handleLogOut}>Logout</h6>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </section>
                    </header>
                    <div className='justify-start text-sm mt-2 cursor-pointer hidden sm:flex md:flex lg:flex xl:flex text-gray-400' onClick={() => navigate("/landing")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current mr-2" viewBox="0 0 55.753 55.753">
                            <path
                                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                                data-original="#000000" />
                        </svg>
                        <p>back to the clients page</p>
                    </div>
                    <div className='flex flex-wrap items-center justify-end px-10 py-3 relative lg:gap-y-4 max-sm:gap-x-4 gap-y-6 w-full'>

                        <div className='flex items-center'>
                            <div
                                className=" border-2 bg-slate-50 outline-[#333] focus-within:outline focus-within:bg-transparent flex px-4 rounded-sm h-10 max-xl:flex max-lg:flex w-full transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-slate-400 mr-3">
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
                                Add Contact
                            </button>
                        </div>
                    </div>
                    {
                        !loadingDone ? (
                            <div className='flex justify-center'>
                                <ReactLoading type="cylon" color="#94a3b8" height={100} width={100} delay={800} />
                            </div>
                        ) : (
                            <div className=" font-[sans-serif] text-[#333] mt-4">
                                <div className="max-w-5xl max-sm:max-w-sm mx-auto">
                                    <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-5 text-center mt-12 ">
                                        {foundContact.length > 0 ? foundContact.map((contactInfo) => {
                                            let formattedBirthday;
                                            if (contactInfo !== undefined && contactInfo !== "" && contactInfo !== null) {
                                                if (contactInfo.Birthday !== undefined
                                                    && contactInfo.Birthday !== null) {
                                                    const birthdayInfo = contactInfo.Birthday;
                                                    const [month, day, year] = birthdayInfo.split("/");
                                                    formattedBirthday = year + "-" + month + "-" + day;
                                                } else {
                                                    if (contactInfo.birthdate !== undefined
                                                        && contactInfo.birthdate !== null) {
                                                        const birthdayInfo = contactInfo.birthdate;
                                                        const [month, day, year] = birthdayInfo.split("/");
                                                        formattedBirthday = year + "-" + month + "-" + day;
                                                    }
                                                }
                                            }

                                            return (
                                                <div id="parentElement" key={contactInfo.Id} className="flex items-center justify-center h-auto relative bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg hover:scale-105 transition-all duration-500">
                                                    <div className="flex flex-col items-center">
                                                        {/* <div className="h-[50px]"> */}
                                                        <div className="bg-white py-4 px-2 rounded-md">
                                                            <img src={"data:image/jpeg;base64," + contactInfo.ProfileImage} alt='Img Error' className="hover:transition-all flex-shrink-0 w-[100px] h-[100px] rounded-full hover:outline hover:outline-offset-2 outline-cyan-500" />
                                                        </div>
                                                        {/* </div> */}
                                                        <div className="flex flex-col justify-center">
                                                            <div className="flex items-center justify-center space-x-1">
                                                                {/* <label className="font-semibold text-xs text-slate-500 ml-2">Contact Person:</label> */}
                                                                <label className="font-semibold text-md">{contactInfo.ContactPerson}</label>

                                                                {/* <p className="text-lg text-slate-500 truncate">{contactInfo.ContactPerson}</p> */}
                                                            </div>
                                                            <div className="flex items-center justify-center space-x-1">
                                                                {/* <label className="font-semibold text-xs text-slate-500 ml-2">Position:</label> */}
                                                                <label className="font-semibold text-xs text-slate-500">{contactInfo.Position}</label>

                                                                {/* <p className="text-xs text-slate-500 truncate">{contactInfo.Position}</p> */}
                                                            </div>
                                                            <div className="flex items-center space-x-1 mt-6">
                                                                {/* <label className="font-semibold text-xs text-slate-500 ml-2">Department:</label> */}
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Department:</label>

                                                                <p className="text-xs text-slate-500 truncate">{contactInfo.Department}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Email:</label>
                                                                <p className="text-xs text-slate-500 truncate">{contactInfo.EmailAddress}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Nickname:</label>
                                                                <p className="text-xs text-slate-500 truncate">{contactInfo.Nickname}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Birthdate:</label>
                                                                <p className="text-xs text-slate-500 truncate">{formattedBirthday}</p>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Contact Number:
                                                                    <div className='flex flex-col justify-end'>
                                                                        <p className="font-normal text-xs text-slate-500 truncate">{contactInfo.ContactNumber ? contactInfo.ContactNumber : "No Added Contact No."}</p>
                                                                        <p className="font-normal text-xs text-slate-500 truncate">{contactInfo.ContactNumber2 ? contactInfo.ContactNumber2 : ""}</p>
                                                                        <p className="font-normal text-xs text-slate-500 truncate">{contactInfo.ContactNumber3 ? contactInfo.ContactNumber3 : ""}</p>
                                                                        {/* <div onClick={handleViewHistory} id={contactInfo.Id} className="absolute top-[168px] left-[280px] sm:top-[185px] sm:left-[200px] md:top-[120px] md:left-[330px] lg:top-[120px] lg:left-[330px] xl:top-[185px] xl:left-[300px] m-2 flex items-center justify-center rounded-md bg-slate-100 cursor-pointer">
                                                                            (View History)
                                                                            <div name="historyDropdown" id={contactInfo.Id} className="hidden flex-col z-50 bg-slate-200 p-2 w-[170px] sm:min-w-[10px] max-sm:min-w-[120px] absolute top-5 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]">
                                                                                {
                                                                                    contactHistory.length > 0 ? contactHistory.map((history) => {
                                                                                        return (
                                                                                            <div className="flex items-center space-x-1" key={contactInfo.contactId}>
                                                                                                <label className="font-semibold text-xs text-slate-500 ml-2">{history.ContactNumber}</label>
                                                                                                <p className="text-xs text-slate-500">{history.LastModifiedDesc}</p>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                        :
                                                                                        <p className="font-normal text-xs text-slate-500 truncate">"No Contact History."</p>
                                                                                }
                                                                            </div>
                                                                        </div> */}

                                                                    </div>
                                                                </label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='flex flex-col items-center mt-8'>
                                                        <div className='flex flex-col justify-start'>
                                                            <div className="flex items-center space-x-1">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Sales in charge:</label>
                                                                <p className="text-xs text-slate-500 truncate">{contactInfo.SalesPerson}</p>
                                                            </div>
                                                            <div className="flex items-center mt-0.5">
                                                                <label className="font-semibold text-xs text-slate-500 ml-2">Description:</label>
                                                            </div>
                                                            <input placeholder={contactInfo.Remarks == "" ? "No remarks added." : contactInfo.Remarks} disabled
                                                                className="truncate mt-0.5 p-4 bg-white max-w-md mx-auto w-[300px] sm:w-[300px] md:w-[300px] lg:w-[350px] xl:w-[350px] block text-sm border mb-5 border-slate-300 outline-slate-700 rounded" rows="2"></input>
                                                        </div>
                                                    </div> */}
                                                    {/* Ellipsis icon */}
                                                    <div className="absolute top-0 right-0 m-2 flex items-center justify-center rounded-md bg-slate-100 cursor-pointer" onClick={handleOpenKebab} id="menuOpen">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" key={contactInfo.Id} data-key={contactInfo.Id}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                        </svg>

                                                        <div name="kebabDropdown" id={contactInfo.Id} className="hidden flex-col z-50 bg-slate-200 p-2 w-[170px] sm:min-w-[10px] max-sm:min-w-[120px] absolute right-0 top-6 rounded-md shadow-[2px_5px_10px_-3px_rgba(6,81,237,0.3)]">
                                                            <button onClick={handleEditMode} id={contactInfo.Id} className="text-sm cursor-pointer hover:text-slate-400 rounded-sm flex items-center space-x-1 mb-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                </svg>
                                                                <span id={contactInfo.Id}>Edit</span>
                                                            </button>
                                                            <button id={contactInfo.Id} className="text-sm cursor-pointer hover:text-red-400 rounded-sm flex items-center space-x-1" onClick={handleDeleteContact}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                                <span id={contactInfo.Id}>Remove</span>
                                                            </button>
                                                        </div>

                                                    </div>

                                                </div>


                                            )
                                        })
                                            :
                                            <div className='flex items-center justify-center'>
                                                <h2 className='font-bold'>No Contact Person Found.</h2>

                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        )
                    }



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
                                            src={"data:image/jpeg;base64," + selectedImage}
                                            className='w-36 h-36 rounded-sm inline-block'
                                        />
                                        <button className='mt-2 hover:text-red-500' onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}


                                <div className="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label className="text-base text-slate-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        accept="image/png, image/gif, image/jpeg"
                                        className="w-full text-slate-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-slate-100 file:hover:bg-slate-200 file:text-slate-500 rounded" />
                                    <p className="text-xs text-slate-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
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
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
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
                                            Position</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            value={position}
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
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            name='birthdate'
                                            value={birthdate}
                                            onChange={handleOnChange}
                                            max={new Date().toJSON().slice(0, 10)}
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
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
                                            value={contactNumber}
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
                                            value={contactNumber2}
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
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
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
                                            value={emailAddress}
                                            name='emailAddress'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
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
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Remarks</label>
                                        <textarea placeholder="Enter Remarks"
                                            onChange={handleOnChange}
                                            value={remarks}
                                            name='remarks'
                                            autoComplete='off'
                                            required
                                            className="p-4 bg-white max-w-md mx-auto w-full block text-sm border mb-10 border-slate-300 outline-slate-700 rounded" rows="3"></textarea>
                                    </div>
                                </div>
                                <button type="submit"
                                    className="px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
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
                                            src={"data:image/jpeg;base64," + selectedImage}
                                            className='w-36 h-36 rounded-sm inline-block'
                                        />
                                        <button className='mt-2 hover:text-red-500' onClick={() => setSelectedImage(null)}>Remove</button>
                                    </div>
                                )}
                                <div className="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label className="text-base text-slate-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        accept="image/png, image/gif, image/jpeg"
                                        className="w-full text-slate-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-slate-100 file:hover:bg-slate-200 file:text-slate-500 rounded" />
                                    <p className="text-xs text-slate-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
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
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
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
                                            value={position}
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
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            // placeholder="MM-dd-yyyy"
                                            // format="MM-dd-yyyy"
                                            name='birthdate'
                                            value={birthdate}
                                            max={new Date().toJSON().slice(0, 10)}
                                            onChange={handleOnChange}
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
                                    </div>
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
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
                                            value={contactNumber}
                                            autoComplete='off'
                                            required
                                            pattern='^[+]?[\d]+([\-][\d]+)*\d$'
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
                                            value={contactNumber2}
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
                                    <div className="relative flex items-center">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="number" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
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
                                            value={emailAddress}
                                            name='emailAddress'
                                            autoComplete='off'
                                            required
                                            className="truncate px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-slate-100 focus:border-slate-500 rounded outline-none" />
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
                                    <div className="relative flex items-center sm:col-span-2">
                                        <label className="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Remarks</label>
                                        <textarea placeholder="Enter Remarks"
                                            onChange={handleOnChange}
                                            value={remarks}
                                            name='remarks'
                                            autoComplete='off'
                                            required
                                            className="p-4 bg-white max-w-md mx-auto w-full block text-sm border mb-10 border-slate-300 outline-slate-700 rounded" rows="3"></textarea>
                                    </div>
                                </div>
                                <button type="submit"
                                    className="mt-8 px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
                            </form>
                        </div>
                    </div>
                    <div
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
                                        <label className="text-slate-400 w-44 text-sm">New Password :</label>
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
                                                <label className="cursor-pointer" name="newpassword" onClick={handleShowPass} htmlFor="check">{showHideNew}</label>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="text-slate-400 w-44 text-sm">Confirm Password :</label>
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
                                                <label className="cursor-pointer" name="confirmpassword" onClick={handleShowPass} htmlFor="check">{showHide}</label>
                                            </a>
                                        </div>
                                    </div>

                                    <button type="submit"
                                        className="px-6 py-2 w-full bg-slate-800 text-sm text-white hover:bg-slate-500 mx-auto block">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientContactInfo