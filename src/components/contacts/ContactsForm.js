import React from "react";

import { useState, useEffect } from "react";
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ApiContactsData from "../../services/ApiContactsData";

import { useParams } from "react-router-dom";


let categories = ['family', 'friend', 'other']
let categObj = { categ0: '', categ1: '', categ2: '' };
let categValues;
let categValuesNoEmpty;
let updatedContact;

export default function ContactsForm({ contactPicked, closeForm }) {
    const token=localStorage.getItem('myToken');
    const [contact, setContact] = useState(contactPicked);
    /* Useffect for rerendering again if initial state (contactPicked) changes */
    useEffect(() => {
        setContact(contactPicked)

    }, [contactPicked]);
  /*      console.log(contact); */



    const { contactId } = useParams();
   

    const allContacts = ApiContactsData() || [];
    const handleChange = (e, newValue, birthNameday) => {
        /* For first and lastname or Avatar */
/*         console.log(e);
        console.log(newValue);
        console.log(birthNameday); */
        if (!birthNameday) {
            const { name, value } = e.target;
            setContact(prevContact => ({ ...prevContact, [name]: value }));
         /* For birth and nameday */   /* I found 2 ways to pass the value in dateTimePicker: interesting! */
        } else { setContact(prevContact => ({ ...prevContact, [birthNameday]: newValue })); };
    }
    

    const handleChangeCategory = () => {
        /* We check with every change wich category remains checked. For that we use map over the categories */
        categories.map((item, index) => {
            const categCheck = document.getElementById(`custom-checkbox-${index}`).checked;
            const categName = document.getElementById(`custom-checkbox-${index}`).name;

            if (categCheck) { categObj['categ' + index] = categName; }
            else { categObj['categ' + index] = null; }
            categValues = Object.values(categObj);
            categValuesNoEmpty = categValues.filter(n => n)
            console.log(categValuesNoEmpty);
            setContact(prevContact => ({ ...prevContact, category: categValuesNoEmpty }))
            
        })
    }

    const checkedCategAuxFunction=(cat)=>{    
        const res =contact.category.includes(cat)
        return res;
    }


    const submitContact = (e) => {
        e.preventDefault();

        updatedContact = {...contact,'category': categValuesNoEmpty};       
        setContact(updatedContact);
        /*   ApiContactsData('POST', updatedContact);  */
       
        if (!contactId)
            postPutContactData('POST', updatedContact);
        else
            postPutContactData('PUT', updatedContact, contactId);
    closeForm(); 
    }
  
    const handleDelete = (e) => {
        /*  e.preventDefault(); */
        const url = "https://projectberlin-backend.herokuapp.com/contacts/" + contactId;

        fetch(url, { method: 'DELETE', headers: {'Authorization':"Bearer "+ token, 'Content-Type': 'application/json'  }})
            .then((res) => { res.text(); })
            .catch((e) => console.log(e.message));

        const timer = setTimeout(() => { closeForm(); }, 150);
        timer();
        clearTimeout(timer);
    }

    const postPutContactData = (requestMethod, objToPass, id) => {
        console.log(objToPass)
        let extUrl = "contacts";
        if (requestMethod === 'PUT')
            extUrl = "contacts" + "/" + id;

        const url = `https://projectberlin-backend.herokuapp.com/${extUrl}`;
        const url2 = `http://localhost:3031/${extUrl}`;
        const requestOptions = {
            /* mode: 'no-cors',  */
            method: requestMethod,
            headers: {'Authorization':"Bearer "+ token, 'Content-Type': 'application/json'  },
            body: JSON.stringify(objToPass)
        }

        fetch(url, requestOptions)
            .then((res) => { res.json(); })
            .catch((e) => console.log(e.message));
    }

    return (
        <div className="sectionContacts">
            <form onSubmit={(e) => submitContact(e)}>
                <legend id='wrappingTitle'>Add/Edit your event</legend>
                <div className="container1">
                    <fieldset className="firstName">
                        <label htmlFor="firstName">
                            FirstName
                        </label>
                        <textarea name="firstName" value={contact.firstName}
                            onChange={handleChange} />
                    </fieldset>
                    <fieldset className="lastName">
                        <label htmlFor="lastName">
                            LastName
                        </label>
                        <textarea name="lastName" value={contact.lastName}
                            onChange={handleChange} />
                    </fieldset>
                </div>

                <div className="container2">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <div className="birthday">

                            <MobileDateTimePicker
                                value={contact.birthday}
                                /* I found 2 ways to pass the value: interesting! */
                                onChange={(newValue) => {
                                    setContact({
                                        ...contact,
                                        'birthday': newValue
                                    })
                                }}

                                label="Birthday"
                                onError={console.log}
                                minDate={new Date('2018-01-01T00:00')}
                                inputFormat="yyyy/MM/dd hh:mm a"
                                mask="___/__/__ __:__ _M"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>
                        <div className="nameday">

                            <MobileDateTimePicker
                                value={contact.nameday}
                                /* I found 2 ways to pass the value: interesting! */
                                onChange={(newValue) => handleChange('', newValue, 'nameday')}
                                name="nameday"
                                label="Nameday"
                                onError={console.log}
                                minDate={new Date('2018-01-01T00:00')}
                                inputFormat="yyyy/MM/dd hh:mm a"
                                mask="___/__/__ __:__ _M"
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </div>

                    </LocalizationProvider>
                </div>
                <div className="container3">
                    <fieldset className="categoryContact">
                        <label htmlFor="category" id='categoryContact'>Category</label>
                        <fieldset className="categForm" >
                            {categories.map((cat, index, contact) => {
                                return (
                                    <li key={index}>
                                        <div >
                                            <input
                                                type="checkbox"
                                                checked={checkedCategAuxFunction(cat)}
                                                id={`custom-checkbox-${index}`}
                                                name={cat}
                                                value={cat}
                                                onChange={() => handleChangeCategory()}
                                                
                                            />
                                            <label htmlFor={`custom-checkbox-${index}`}>{cat}</label>
                                        </div>
                                    </li>
                                );
                            })}
                        </fieldset>
                    </fieldset>
                </div>
                <div className="container4">
                    <fieldset className="avatar">
                        <label htmlFor="avatar_url">Avatar/Pic (Url)</label>
                        <textarea name="avatar_url" value={contact.avatar_url}
                            onChange={handleChange} />
                    </fieldset>

                </div>
              <input className="submitButton" type="submit" value="Add/Modify contact" />  
            </form >
            
            <button className="delButton" onClick={(e) => handleDelete(e)} >               
                <svg xmlns="http://www.w3.org/2000/svg" height="34" viewBox="0 0 24 24" width="34"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
        </div>
    )
}
