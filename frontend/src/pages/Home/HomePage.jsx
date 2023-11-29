import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LoginStatus } from '../../constants/loginStatus';
import { GET_CONFIGS_URL } from '../../constants/url';
import axios from 'axios';
import useNotification from '../../hooks/useNotification';
import { NotificationStatus } from '../../constants/notification';
import extractAPIResponse from '../../utils/extractAPIResponse';
import { getClassWithColor } from 'file-icons-js';
import {
  getMaterialFileIcon
} from 'file-extension-icon-js';
import { Checkbox } from '@mui/material';
import PageSizeGrid from '../../components/PageSizeGrid/PageSizeGrid';

function ConfigurationDashboard() {
  const allFormats = ['docx', 'pptx', 'pdf', 'odt', 'svg', 'png', 'jpg', 'jpeg'];

  const notify = useNotification();

  const [allowedFormats, setAllowedFormats] = useState([]);

  useEffect(() => {
    axios.get(`${GET_CONFIGS_URL}/formats/`)
      .then(({ data }) => extractAPIResponse(data))
      .then(setAllowedFormats)
      .catch((e) => notify(NotificationStatus.ERR, e.message));
  }, []);

  const handleFormatToggle = (format) => {
    if (!allowedFormats.includes(format)) {
      setAllowedFormats([...allowedFormats, format]);
    } else {
      setAllowedFormats([...allowedFormats].filter((f) => f !== format));
    }
  };

  const handleSubmitFormat = () => { 
    notify(NotificationStatus.WAITING);
    axios.post(`${GET_CONFIGS_URL}/formats/`, allowedFormats)
      .then(({ data }) => extractAPIResponse(data))
      .then(() => notify(NotificationStatus.OK))
      .catch((e) => notify(NotificationStatus.ERR, e.message))
  }

  return (
    <>
      <h2 className="font-bold text-3xl my-5 text-blue-900">CONFIG BOARD</h2>
      <div className="bg-white rounded-lg p-5 my-6">
        <div className="flex flex-row items-center gap-2 my-2">
          <h3 className="font-semibold text-xl text-blue-800">Formats</h3>
          <button onClick={handleSubmitFormat} className="text-sm rounded-lg border-2 text-white bg-blue-500 font-bold p-1 active:bg-blue-700">Save</button>
        </div>
        <div className="lg:flex lg:flex-row lg:items-center lg:justify-between">
          { 
            allFormats.map((format) => {
              const checked = allowedFormats.includes(format);
              return ( 
                <div key={format} className="flex-auto flex flex-row items-center gap-2 lg:block">
                  <Checkbox type="checkbox" id={format} checked={checked} onChange={() => handleFormatToggle(format)}
                    className="lg:relative lg:left-[65%] lg:top-[2rem]"
                  />
                  <label htmlFor={format} className="block">
                    <div className="flex flex-row justify-start gap-2 lg:hidden text-lg">
                      <span className={`${getClassWithColor(`example.${format}`)}`}></span>
                      <p>{format.toUpperCase()}</p>
                    </div>
                    <div className="hidden lg:flex lg:flex-col justify-center items-center m-auto">
                      <img src={getMaterialFileIcon(`example.${format}`)} />
                      <p>{format.toUpperCase()}</p>
                    </div>
                  </label>
                </div>
              )
            })
          }
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-5 my-6">
        <div className="flex flex-row items-center gap-2 my-2">
          <h3 className="font-semibold text-xl text-blue-800">Page sizes</h3>
        </div>
        <PageSizeGrid />
      </div>
    </>
  );
}

function Home() {
  const isManager = useSelector(state => state.loginStatus.value) === LoginStatus.MANAGER;

  return (
    <div className="h-full">
      <h1 className="text-center m-auto font-semibold text-3xl"> Hi 👋, BKU lovers</h1>
      <p className="text-center m-auto text-lg mb-10">Enjoy our printing service!</p> 
      { isManager && <ConfigurationDashboard /> }
    </div>
  );
}

export default Home;
