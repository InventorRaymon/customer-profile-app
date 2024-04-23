import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ClientContactInfo = () => {
    const state = useLocation().state;
    const navigate = useNavigate();
    const clientId = state.clientId;
    const token = localStorage.getItem("token");
    const [contactsData, setContactsData] = useState([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState('hidden');
    const [onEditMode, setOnEditMode] = useState('hidden');
    const [selectedImage, setSelectedImage] = useState(null);
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

    const dummyArray = [
        {
            contactPerson: "Koala a",
            position: "dev",
            department: "dev",
            emailAddress: "johnraymonm@gmail.com",
            nickname: "koa",
            birthdate: "09/15/1996",
            contactNumber: "09664268092",
            contactNumber2: "09664268092",
            contactNumber3: "09664268092",
            profileImage: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png",
            Id: "12345",
            clientId: clientId
        },
        {
            contactPerson: "Koala a",
            position: "dev",
            department: "dev",
            emailAddress: "johnraymonm@gmail.com",
            nickname: "koa",
            birthdate: "09/15/1996",
            contactNumber: "09664268092",
            contactNumber2: "09664268092",
            contactNumber3: "09664268092",
            profileImage: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png",
            Id: "12345",
            clientId: clientId
        },
        {
            contactPerson: "Koala a",
            position: "dev",
            department: "dev",
            emailAddress: "johnraymonm@gmail.com",
            nickname: "koa",
            birthdate: "09/15/1996",
            contactNumber: "09664268092",
            contactNumber2: "09664268092",
            contactNumber3: "09664268092",
            profileImage: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png",
            Id: "12345",
            clientId: clientId
        }
    ]



    const getContactList = async () => {
        try {
            const { data } = await axios.get(
                "http://172.16.61.121:7001/api/mobileapi/GetAllCustomerList/" + clientId,
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
    }, [contactsData]);

    const handleAddContactOpen = () => {
        setIsContactModalOpen("block")
    }

    const handlContactMocalClose = () => {
        setIsContactModalOpen("hidden")
    }

    const handleFileRead = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertBase64(file);
        setSelectedImage(base64);
        setInputValue({ ...inputValue, "profileImage": base64.toString() })

    }

    // const handleDateOnChange = (e) => {
    //     e.preventDefault();
    //     const selectedDate = e.target.value;
    //     const [year, month, day] = selectedDate.split('-');
    //     const formattedDate = month + "/" + day + "/" + year;    
    //     setInputValue({ ...inputValue, "birthdate": formattedDate })
    // }

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
        // console.log(inputValue)
        // const selectedDate = birthdate;
        // const [year, month, day] = selectedDate.split('-');
        // const formattedDate = month + "/" + day + "/" + year; 
        // console.log(formattedDate)
        try {
            const { data } = await axios.post(
                "http://172.16.61.121:7001/api/mobileapi/PostCustomer",
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
                setTimeout(() => {
                    handlContactMocalClose();
                    handleEditMocalClose();
                }, 700);
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
                "http://172.16.61.121:7001/api/mobileapi/DeleteCustomer",
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
                navigate("/clientcontacts",
                    {
                        state: { clientId }
                    }
                );
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
        const parentElement = e.target.closest("#parentElement");
        const contactId = parentElement.getAttribute('data-key');

        for (let index in contactsData) {
            let contactInfo = contactsData[index];
            let formattedBirthday = "";
            if (contactInfo.Birthday !== undefined) {
                const birthdayInfo = contactInfo.Birthday;
                const [month, day, year] = birthdayInfo.split("/");
                formattedBirthday = year + "-" + month + "-" + day;
            } else {
                const birthdayInfo = contactInfo.birthdate;
                const [month, day, year] = birthdayInfo.split("/");
                formattedBirthday = year + "-" + month + "-" + day;
            }
            if (contactInfo.Id === contactId) {
                setSelectedImage(contactInfo.ProfileImage)
                setInputValue({
                    ...inputValue,
                    Id: contactId,
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

    return (
        <>
            <div class="font-[sans-serif] text-[#333] bg-gray-50 p-4">
                <div class="max-w-5xl max-sm:max-w-sm mx-auto">
                    <header class='shadow-md font-[sans-serif] tracking-wide relative z-50'>
                        <section class='md:flex lg:items-center relative py-3 lg:px-10 px-4 border-gray-200 border-b bg-white lg:min-h-[80px] max-lg:min-h-[60px] bg-gradient-to-r from-slate-900 via-slate-500 via-50% to-slate-900 to 90%'>

                            <div class="flex items-center cursor-pointer" onClick={() => navigate("/landing")}>
                                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38729f07d05db3f41c27ee156c71cd47b20092f86cd671e4bd60abbf7867104d" alt="logo" class='shrink w-55 h-14 mr-4' />
                                <span class="font-bold text-3xl text-white max-md:mt-10">
                                    COSMOHUB
                                </span>
                            </div>
                            {/* <div class='flex flex-wrap w-full items-center'>
            <input type='text' placeholder='Search something...'
                class='xl:w-96 max-lg:w-full lg:ml-20 max-md:mt-4 max-lg:ml-4 bg-gray-100 focus:bg-transparent px-6 rounded h-11 outline-[#fdfdfd] text-sm transition-all text-white' />
        </div> */}
                        </section>
                    </header>
                    {/* <div class="bg-gray-50 grid lg:grid-cols-2 gap-6 sm:px-8 px-4 py-16 font-[sans-serif] text-[#333]">
                        <div class="space-y-6">
                            <div class="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg transition-all" role="accordion">
                                <button type="button" class="w-full text-base font-semibold text-left p-6 text-blue-600
           flex items-center hover:text-blue-600 transition-all">
                                    <span class="mr-4">Are there any special discounts or promotions available during the event.</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 124 124">
                                        <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000" />
                                    </svg>
                                </button>
                                <div class="pb-5 px-6">
                                    <p class="text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor auctor arcu,
                                        at fermentum dui. Maecenas
                                        vestibulum a turpis in lacinia. Proin aliquam turpis at erat venenatis malesuada. Sed semper, justo vitae
                                        consequat fermentum, felis diam posuere ante, sed fermentum quam justo in dui. Nulla facilisi. Nulla aliquam
                                        auctor purus, vitae dictum dolor sollicitudin vitae. Sed bibendum purus in efficitur consequat. Fusce et
                                        tincidunt arcu. Curabitur ac lacus lectus. Morbi congue facilisis sapien, a semper orci facilisis in.
                                    </p>
                                </div>
                            </div>
                            <div class="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg transition-all" role="accordion">
                                <button type="button" class="w-full text-base font-semibold text-left p-6 text-[#333] flex items-center hover:text-blue-600 transition-all">
                                    <span class="mr-4">What are the dates and locations for the product launch events?</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 42 42">
                                        <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000" />
                                    </svg>
                                </button>
                                <div class="hidden pb-5 px-6">
                                    <p class="text-sm text-gray-500">Content</p>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg transition-all" role="accordion">
                                <button type="button" class="w-full text-base font-semibold text-left p-6 text-[#333] flex items-center hover:text-blue-600 transition-all">
                                    <span class="mr-4">Can I bring a guest with me to the product launch event?</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 42 42">
                                        <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000" />
                                    </svg>
                                </button>
                                <div class="hidden pb-5 px-6">
                                    <p class="text-sm text-gray-500">Content</p>
                                </div>
                            </div>
                            <div class="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-lg transition-all" role="accordion">
                                <button type="button" class="w-full text-base font-semibold text-left p-6 text-[#333] flex items-center hover:text-blue-600 transition-all">
                                    <span class="mr-4">Are there any special discounts or promotions available during the event.</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 42 42">
                                        <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000" />
                                    </svg>
                                </button>
                                <div class="hidden pb-5 px-6">
                                    <p class="text-sm text-gray-500">Content</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div class="font-[sans-serif] text-[#333] bg-gray-50 p-2">
                        <div class="max-w-5xl max-sm:max-w-sm mx-auto">
                            <h2 class="text-3xl font-semibold flex-center">Client Contacts</h2>
                            <button type="button"
                                onClick={handleAddContactOpen}
                                class="m-10 px-4 py-2.5 flex items-center text-[#fff] rounded-full text-sm font-semibold outline-none transition-all bg-slate-600 hover:bg-indigo-700 active:bg-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" class="mr-2" viewBox="0 0 6.35 6.35">
                                    <path fill-rule="evenodd" d="M3.181.264A2.92 2.92 0 0 0 .264 3.18a2.922 2.922 0 0 0 2.917 2.917A2.92 2.92 0 0 0 6.096 3.18 2.919 2.919 0 0 0 3.18.264zm0 .53A2.38 2.38 0 0 1 5.566 3.18 2.382 2.382 0 0 1 3.18 5.566 2.384 2.384 0 0 1 .794 3.179 2.383 2.383 0 0 1 3.181.794zm-.004 1.057a.265.265 0 0 0-.263.27v.794h-.793a.265.265 0 0 0-.028 0 .266.266 0 0 0 .028.53h.793v.794a.265.265 0 0 0 .531 0v-.793h.794a.265.265 0 0 0 0-.531h-.794v-.794a.265.265 0 0 0-.268-.27z" data-original="#000000" paint-order="stroke fill markers" />
                                </svg>
                                Add Contact
                            </button>

                            <div class="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-8 text-center mt-12">

                                {contactsData && contactsData.map((contactInfo) => {
                                    let formattedBirthday = "";
                                    if (contactInfo.Birthday !== undefined) {
                                        const birthdayInfo = contactInfo.Birthday;
                                        const [month, day, year] = birthdayInfo.split("/");
                                        formattedBirthday = year + "-" + month + "-" + day;
                                    } else {
                                        const birthdayInfo = contactInfo.birthdate;
                                        const [month, day, year] = birthdayInfo.split("/");
                                        formattedBirthday = year + "-" + month + "-" + day;
                                    }
                                    return (
                                        <>
                                            <div key={contactInfo.Id} data-key={contactInfo.Id} id="parentElement" class="bg-slate-200 py-1 px-2 rounded-md">
                                                <div class="mt-2 mb-2">
                                                    <div class="bg-white py-4 px-2 rounded-md ">
                                                        {/* <button type="button" class="w-full text-base font-semibold text-left p-6 text-[#333] flex items-center hover:text-slate-500 transition-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 42 42">
                                                                <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000" />
                                                            </svg>
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 fill-current ml-auto shrink-0" viewBox="0 0 124 124">
                                        <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000" />
                                    </svg>
                                                        </button> */}
                                                        <img src={contactInfo.ProfileImage} alt='Img Error' class="w-36 h-36 rounded-sm inline-block" />

                                                        <div class="mt-4">
                                                            <form class="font-[sans-serif] m-6 max-w-4xl mx-auto">
                                                                <div class="grid sm:grid-cols-2 gap-10">
                                                                    <div class="relative flex items-center sm:col-span-2">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                            Fullname</label>
                                                                        <input type="text" placeholder={contactInfo.ContactPerson}
                                                                            onChange={handleOnChange}
                                                                            name='contactPerson'
                                                                            value={contactInfo.ContactPerson}
                                                                            disabled
                                                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                                                            viewBox="0 0 24 24">
                                                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                                            <path
                                                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                                                data-original="#000000"></path>
                                                                        </svg>
                                                                    </div>
                                                                    <div class="relative flex items-center ">

                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                            Nickname</label>
                                                                        <input type="text" placeholder={contactInfo.Nickname}
                                                                            onChange={handleOnChange}
                                                                            name='nickname'
                                                                            value={contactInfo.Nickname}
                                                                            disabled
                                                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                                                            viewBox="0 0 24 24">
                                                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                                            <path
                                                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                                                data-original="#000000"></path>
                                                                        </svg>
                                                                    </div>
                                                                    <div class="relative flex items-center">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                            Position</label>
                                                                        <input type="text" placeholder={contactInfo.Position}
                                                                            name='position'
                                                                            value={contactInfo.Position}
                                                                            onChange={handleOnChange}
                                                                            disabled
                                                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                                                            viewBox="0 0 24 24">
                                                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                                                            <path
                                                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                                                data-original="#000000"></path>
                                                                        </svg>
                                                                    </div>
                                                                    <div class="relative flex items-center">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                            Birth Date</label>

                                                                        <input
                                                                            type="date"
                                                                            // placeholder="MM-dd-yyyy"
                                                                            // format="MM-dd-yyyy"
                                                                            name='birthdate'
                                                                            disabled
                                                                            value={formattedBirthday}
                                                                            onChange={handleOnChange}
                                                                            class="px-3 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                    </div>
                                                                    <div class="relative flex items-center">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                                                        <input type="text" placeholder={contactInfo.Department}
                                                                            name='department'
                                                                            value={contactInfo.Department}
                                                                            onChange={handleOnChange}
                                                                            disabled
                                                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" class="w-[18px] h-[18px] absolute right-4"
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
                                                                    <div class="relative flex items-center sm:col-span-2">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                            Contact No.</label>
                                                                        <input type="text" placeholder={contactInfo.ContactNumber}
                                                                            onChange={handleOnChange}
                                                                            name="contactNumber"
                                                                            value={contactInfo.ContactNumber + ", " + contactInfo.ContactNumber2 + ", " + contactInfo.ContactNumber2}
                                                                            disabled
                                                                            class="px-1 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        {/* <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                                                    <path
                                                                        d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                                        data-original="#000000"></path>
                                                                </svg> */}
                                                                    </div>
                                                                    {/* <div class="relative flex items-center sm:col-span-2">
                                                                <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                    Contact No. 2</label>
                                                                <input type="text" placeholder={contactInfo.ContactNumber2}
                                                                    onChange={handleOnChange}
                                                                    value={contactInfo.ContactNumber2}
                                                                    name='contactNumber2'
                                                                    disabled
                                                                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                                                    <path
                                                                        d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                                        data-original="#000000"></path>
                                                                </svg>
                                                            </div>
                                                            <div class="relative flex items-center sm:col-span-2">
                                                                <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                                                    Contact No. 3</label>
                                                                <input type="text" placeholder={contactInfo.ContactNumber3}
                                                                    onChange={handleOnChange}
                                                                    name='contactNumber3'
                                                                    value={contactInfo.ContactNumber3}
                                                                    disabled
                                                                    class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                                                    <path
                                                                        d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                                        data-original="#000000"></path>
                                                                </svg>
                                                            </div> */}
                                                                    <div class="relative flex items-center sm:col-span-2">
                                                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Email</label>
                                                                        <input type="email" placeholder={contactInfo.EmailAddress}
                                                                            onChange={handleOnChange}
                                                                            value={contactInfo.EmailAddress}
                                                                            name='emailAddress'
                                                                            disabled
                                                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                                                            viewBox="0 0 682.667 682.667">
                                                                            <defs>
                                                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                                                </clipPath>
                                                                            </defs>
                                                                            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                                                <path fill="none" stroke-miterlimit="10" stroke-width="40"
                                                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                                                    data-original="#000000"></path>
                                                                                <path
                                                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                                                    data-original="#000000"></path>
                                                                            </g>
                                                                        </svg>

                                                                    </div>


                                                                </div>
                                                                <div class="mt-2 font-[sans-serif] w-max mx-auto bg-gray-200 border divide-x divide-white flex rounded overflow-hidden">
                                                                    <button type="button"
                                                                        onClick={handleEditMode}
                                                                        class="px-4 py-2.5 flex items-center text-[#333] text-sm font-semibold outline-none hover:bg-gray-300 transition-all">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="currentColor" class="mr-2" viewBox="0 0 24 24">
                                                                            <path d="m20 8.6-8.38 8.38c-.29.29-.67.47-1.08.51l-2.93.27H7.5c-.33 0-.65-.13-.88-.37-.26-.26-.39-.63-.36-1l.27-2.93c.04-.41.22-.79.51-1.08L15.4 4zm1.94-5.83-.71-.71a2.758 2.758 0 0 0-3.89 0l-.88.88 4.6 4.6.88-.88a2.732 2.732 0 0 0 0-3.88zm-1.19 16.24V13.2c0-.41-.34-.75-.75-.75s-.75.34-.75.75v5.81c0 1.24-1.01 2.25-2.25 2.25H5c-1.24 0-2.25-1.01-2.25-2.25V7c0-1.24 1.01-2.25 2.25-2.25h5.81c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H5C2.93 3.25 1.25 4.93 1.25 7v12c0 2.07 1.68 3.75 3.75 3.75h12c2.07 0 3.75-1.68 3.75-3.75z" data-original="#000000" />
                                                                        </svg>
                                                                        Edit
                                                                    </button>
                                                                    <button type="button"
                                                                        onClick={handleDeleteContact}
                                                                        class="px-4 py-2.5 flex items-center text-[#333] text-sm font-semibold outline-none hover:bg-gray-300 transition-all">
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
                                        </>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                    <div
                        class={isContactModalOpen + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
                        <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                            <div class="flex items-center pb-3 border-b text-black">
                                <h3 class="text-xl font-bold flex-1">Add Contact</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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

                            <form class="font-[sans-serif] m-6 max-w-4xl mx-auto">
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


                                <div class="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label class="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        class="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                                    <p class="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                                </div>

                                <div class="grid sm:grid-cols-2 gap-10">
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Fullname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='contactPerson'
                                            value={contactPerson}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">

                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Position</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            value={position}
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" class="w-[18px] h-[18px] absolute right-4"
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
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 1</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name="contactNumber"
                                            value={contactNumber}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 2</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            value={contactNumber2}
                                            name='contactNumber2'
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center sm:col-span-2">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Email</label>
                                        <input type="email" placeholder="Enter email"
                                            onChange={handleOnChange}
                                            value={emailAddress}
                                            name='emailAddress'
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 682.667 682.667">
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                </clipPath>
                                            </defs>
                                            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                <path fill="none" stroke-miterlimit="10" stroke-width="40"
                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                    data-original="#000000"></path>
                                                <path
                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                    data-original="#000000"></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <button type="button"
                                    onClick={handleAddContact}
                                    class="mt-8 px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
                            </form>
                        </div>
                    </div>
                    <div
                        class={onEditMode + " fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]"}>
                        <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                            <div class="flex items-center pb-3 border-b text-black">
                                <h3 class="text-xl font-bold flex-1">Edit Contact</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 ml-2 cursor-pointer shrink-0 fill-black hover:fill-red-500"
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

                            <div class="font-[sans-serif]">
                            </div>
                            <form class="font-[sans-serif] m-6 max-w-4xl mx-auto">
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
                                <div class="font-[sans-serif] max-w-md mx-auto m-5">
                                    <label class="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                                    <input type="file"
                                        onChange={e => handleFileRead(e)}
                                        class="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" />
                                    <p class="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                                </div>

                                <div class="grid sm:grid-cols-2 gap-10">
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Fullname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='contactPerson'
                                            value={contactPerson}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">

                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Nickname</label>
                                        <input type="text" placeholder="Enter full name"
                                            onChange={handleOnChange}
                                            name='nickname'
                                            value={nickname}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Position</label>
                                        <input type="text" placeholder="Enter company position"
                                            name='position'
                                            value={position}
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path
                                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Birth Date</label>

                                        <input
                                            type="date"
                                            // placeholder="MM-dd-yyyy"
                                            // format="MM-dd-yyyy"
                                            name='birthdate'
                                            value={birthdate}
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                    viewBox="0 0 24 24">
                                    <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                    <path
                                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                        data-original="#000000"></path>
                                </svg> */}
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Department</label>
                                        <input type="text" placeholder="Enter department"
                                            name='department'
                                            value={department}
                                            onChange={handleOnChange}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" class="w-[18px] h-[18px] absolute right-4"
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
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 1</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name="contactNumber"
                                            value={contactNumber}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 2</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            value={contactNumber2}
                                            name='contactNumber2'
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">
                                            Contact No. 3</label>
                                        <input type="text" placeholder="Enter phone no."
                                            onChange={handleOnChange}
                                            name='contactNumber3'
                                            value={contactNumber3}
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
                                            <path
                                                d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                                                data-original="#000000"></path>
                                        </svg>
                                    </div>
                                    <div class="relative flex items-center sm:col-span-2">
                                        <label class="text-[13px] bg-white text-black absolute px-2 top-[-10px] left-[18px] font-semibold">Email</label>
                                        <input type="email" placeholder="Enter email"
                                            onChange={handleOnChange}
                                            value={emailAddress}
                                            name='emailAddress'
                                            class="px-4 py-3.5 bg-white text-black w-full text-sm border-2 border-gray-100 focus:border-slate-500 rounded outline-none" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
                                            viewBox="0 0 682.667 682.667">
                                            <defs>
                                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                                </clipPath>
                                            </defs>
                                            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                                <path fill="none" stroke-miterlimit="10" stroke-width="40"
                                                    d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                                                    data-original="#000000"></path>
                                                <path
                                                    d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                                                    data-original="#000000"></path>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                                <button type="button"
                                    onClick={handleAddContact}
                                    class="mt-8 px-6 py-2.5 w-full text-sm font-semibold bg-slate-500 text-white rounded hover:bg-slate-600">Submit</button>
                            </form>
                        </div>
                    </div>
                    <footer class="bg-gray-100 font-[sans-serif]">
                        <div class="py-8 px-4 sm:px-12">
                            <p class='text-center text-gray-700 text-base'>Copyright © 2023<a href='https://readymadeui.com/'
                                target='_blank' class="hover:underline mx-1">ReadymadeUI</a>All Rights Reserved.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    )
}

export default ClientContactInfo