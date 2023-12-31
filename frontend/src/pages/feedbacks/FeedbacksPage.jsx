import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Pagination } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DELETE_FEEDBACKS_URL, GET_FEEDBACKS_URL, UPLOAD_FEEDBACKS_URL } from '../../constants/url';
import extractAPIResponse from '../../utils/extractAPIResponse';
import { NotificationStatus } from '../../constants/notification';
import useNotification from '../../hooks/useNotification';
import { LoginStatus } from '../../constants/loginStatus';
import images from '../../../assets/images/images';
import formatDate from '../../utils/formatDate';
import getId from '../../utils/getId';

const paginationSize = 5;

/**
 *
 */
export default function FeedbacksPage() {
  const notify = useNotification();
  const userId = getId();
  const [feedbacks, setFeedbacks] = useState(null);
  const [totalFeedbacks, setTotalFeedbacks] = useState(null);
  const [typedFeedback, setTypedFeedback] = useState('');
  const [disabledFeedback, setDisabledFeedback] = useState(false);
  const [page, setPage] = useState(0);
  const startFeedbackId = page * paginationSize;
  const endFeedbackId = (page + 1) * paginationSize;
  const onTypedFeedbackChange = (e) => setTypedFeedback(e.target.value);

  const refreshFeedbacks = () => axios.get(`${GET_FEEDBACKS_URL}?start=${startFeedbackId}&end=${endFeedbackId}`)
    .then(({ data }) => extractAPIResponse(data))
    .then(({ feedbacks: _feedbacks, total }) => {
      setFeedbacks(_feedbacks);
      setTotalFeedbacks(total);
    })
    .catch((e) => notify(NotificationStatus.ERR, e.message));

  const onSubmitFeedback = () => {
    if (typedFeedback === '') {
      notify(NotificationStatus.ERR, 'A feedback must not be empty!');
    } else {
      setDisabledFeedback(true);
      notify(NotificationStatus.WAITING, '');
      axios.post(UPLOAD_FEEDBACKS_URL, [{
        content: typedFeedback,
      }])
        .then(({ data }) => extractAPIResponse(data))
        .then(() => notify(NotificationStatus.OK, ''))
        .then(() => (page === Math.floor(totalFeedbacks / paginationSize)
          ? refreshFeedbacks()
          : undefined))
        .then(() => setTypedFeedback(''))
        .then(() => setTotalFeedbacks(totalFeedbacks + 1))
        .catch((e) => notify(NotificationStatus.ERR, e.message))
        .then(() => setDisabledFeedback(false));
    }
  };
  const isManager = useSelector((state) => state.loginStatus.value) === LoginStatus.MANAGER;

  useEffect(() => { refreshFeedbacks(); }, [page]);

  const handleDeleteButton = async (id) => {
    notify(NotificationStatus.WAITING);
    await axios.post(DELETE_FEEDBACKS_URL, [id]);
    try {
      await refreshFeedbacks();
      notify(NotificationStatus.OK);
    } catch (e) {
      notify(NotificationStatus.ERR);
    }
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-blue-900 my-6 font-bold text-3xl">
        ĐÁNH GIÁ
      </h1>
      <div>
        {
          !isManager
          && (
          <form className="my-5">
            <div className="w-full min-h-[3rem] flex flex-col m-auto">
              <textarea value={typedFeedback} disabled={disabledFeedback} onChange={onTypedFeedbackChange} id="feedback" className="w-full border-blue-400 focus:border-blue-600 border-2 rounded-md p-5 m-2" />
              <Button onClick={onSubmitFeedback} className="m-2 self-end">Gửi đánh giá</Button>
            </div>
          </form>
          )
        }
      </div>
      {
        !feedbacks
        && (
        <div className="h-full flex items-center justify-center">
          <CircularProgress size={80} />
        </div>
        )
      }
      {
        feedbacks && (totalFeedbacks === 0 ? <p>Không có đánh giá nào</p>
          : (
            <div>
              {
                totalFeedbacks > 0
                && (
                  <Pagination
                    count={Math.ceil(totalFeedbacks / paginationSize)}
                    onChange={(e, _page) => setPage(_page - 1)}
                  />
                )
              }
              <div className="flex flex-col [&>*:nth-child(odd)]:bg-blue-100 [&>*:nth-child(even)]:bg-slate-200">
                {
              feedbacks.map((feedback) => (
                <div className="m-2 flex flex-row border-2 gap-10 p-5" key={feedback.id}>
                  <div className="flex flex-row items-center">
                    <img
                      className="block h-max-[80px] w-[80px]"
                      src={images.avatar}
                    />
                  </div>
                  <div className="flex-auto">
                    <p className="flex flex-row items-center gap-2">
                      <span className="font-bold text-lg">{ feedback.user.user.name }</span>
                      { feedback.userId === userId && <button onClick={() => handleDeleteButton(feedback.id)} className="rounded-lg bg-red-500 active:bg-red-700 font-bold text-white p-1 text-sm"> Thu hồi </button> }
                    </p>
                    <p>
                      <span className="font-light text-sm">{ formatDate(new Date(feedback.postedAt)) }</span>
                    </p>
                    <p className="min-h-[60px] max-h-[100px] overflow-y-auto whitespace-pre-wrap">{ feedback.content }</p>
                  </div>
                </div>
              ))
            }
              </div>
            </div>
          ))
      }
    </div>
  );
}
