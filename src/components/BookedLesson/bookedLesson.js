import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'

import RequireLessonModal from '~components/RequireLessonModal'
import LessonUpcomingCard from "~components/LessonUpcomingCard"
import CancelBookingLessonModal from "~components/CancelBookingLessonModal"
import PopUpCancelLesson from "~components/PopUpCancelLesson"

import SkeletonLessonCard from "~components/common/Skeleton/SkeletonLessonCard"
import { getUpcomingLessons } from "~src/api/studentAPI"
import { convertDateFromTo, checkCancelTime } from "~src/utils.js"
import Pagination from "react-js-pagination";
import { ToastContainer } from 'react-toastify'
import { FETCH_ERRORS } from "~components/common/Constant/message"
import { toast } from 'react-toastify'
import 'react-toastify/scss/main.scss'
import { toastInit } from "~src/utils"
import { FETCH_ERROR } from '~components/common/Constant/toast'

import styles from '~components/BookedLesson/bookedLesson.module.scss'

const initialCancelLesson = {
  BookingID: "",
  LessionName: "",
  date: "",
  start: "",
  end: "",
  reason: "",
}
const initialRequireLesson = {
  BookingID: "",
  avatar: "",
  TeacherUID: "",
  TeacherName: "",
  LessionMaterial: "",
  LessionName: "",
  SpecialRequest: "",
  date: "",
  start: "",
  end: "",
  DocumentName: "",
  SkypeID: "",
}

const BookedLesson = () => {
  const [state, setState] = useState(null);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(0);
  const [totalResult, setTotalResult] = useState(0);
  const cancelToastFail = () => toast.error(FETCH_ERROR, toastInit);

  const [lock, setLock] = useState({
    id: "",
    lock: false,
  })
  const [stateCancelLesson, setStateCancelLesson] = useState(initialCancelLesson);
  const [stateRequireLesson, setStateRequireLesson] = useState(initialRequireLesson);

  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    if (page !== pageNumber) {
      setPage(pageNumber);
      getAPI({
        Page: pageNumber,
      })
    }
  }
  const handleRequireLesson = (BookingID, avatar, TeacherUID, TeacherName, LessionMaterial, LessionName, SpecialRequest, date, start, end, DocumentName, SkypeID) => {
    setStateRequireLesson({
      ...stateRequireLesson,
      BookingID,
      avatar,
      TeacherUID,
      TeacherName,
      LessionMaterial,
      LessionName,
      SpecialRequest,
      date,
      start,
      end,
      DocumentName,
      SkypeID
    })
  }
  const handleCancelBooking = (BookingID, LessionName, date, start, end) => {
    setStateCancelLesson({
      ...stateCancelLesson,
      BookingID,
      LessionName,
      date,
      start,
      end
    })
  }
  const cbCancelBooking = (id, result, LessionName, date, start, end, reason) => {
    if (result === -1) //Start Call API, lock the card
    {
      setLock({
        id,
        lock: true
      })
    }
    else { //After call API, unlock the card
      setLock({
        id,
        lock: false
      })
      if (result === 1) { // cancel lesson success
        setStateCancelLesson({
          ...stateCancelLesson,
          reason,
        })
        if (pageSize < totalResult) {
          getAPI({
            Page: 1,
          })
          setPage(1);
        }
        else {
          let newUpcomingLessions = [...state];
          newUpcomingLessions = newUpcomingLessions.filter(item => item.BookingID !== id)
          setState(newUpcomingLessions)
        }
        $('#md-cancel-schedule-popup').modal("show");
      }
      else cancelToastFail(); //Cancel Lesson Fail
    }
  }
  const cbRequireLesson = (SpecialRequest, BookingID, TeacherUID) => {
    let newState = [...state]
    const index = newState.findIndex
      (item => item.BookingID === BookingID && item.TeacherUID === TeacherUID);
    newState[index].SpecialRequest = SpecialRequest;
    setState(newState)
  }
  const getAPI = async (params) => {
    setLoading(true);
    const res = await getUpcomingLessons(params);
    if (res.Code === 1) {
      setState(res.Data)
      setPageSize(res.PageSize);
      setTotalResult(res.TotalResult)
    }
    else {
      setState(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAPI({
      Page: 1,
    })
  }, []);

  return <>
    <h4 className="mg-b-15 gradient-heading"><i className="fas fa-calendar-check" />CÁC LỚP ĐÃ ĐĂNG KÝ</h4>
    {
      !!state ? <>
        <div className="feedback-container">
          <div className="course-horizental animated fadeInUp am-animation-delay-1">
            {
              !!state && !!state &&
                state.length + state.length === 0 ? (
                  <div className="empty-error tx-center mg-y-30 cr-item bg-white pd-15 rounded-5 shadow">
                    <img src="../assets/img/no-booking.svg" alt="image" className="wd-200 mg-b-15" />
                    <p className=" tx-danger tx-medium">Bạn không có buổi học nào sắp tới.</p>
                    <a href="/ElearnStudent/bookingLesson" className="btn btn-primary">Đặt lịch học</a>
                  </div>) : ""
            }
            <ul className="list-wrap">
              {
                !!state && state.length > 0 &&
                state.map(item => loading ? <SkeletonLessonCard key={item.BookingID} /> :
                  <LessonUpcomingCard
                    key={item.BookingID}
                    BookingID={item.BookingID}
                    TeacherUID={item.TeacherUID}
                    avatar={item.TeacherIMG}
                    TeacherName={item.TeacherName}
                    LessionName={item.LessionName}
                    LessionMaterial={item.LessionMaterial}
                    start={convertDateFromTo(item.ScheduleTimeVN).fromTime}
                    end={convertDateFromTo(item.ScheduleTimeVN).endTime}
                    date={convertDateFromTo(item.ScheduleTimeVN).date}
                    SpecialRequest={item.SpecialRequest}
                    DocumentName={item.DocumentName}
                    SkypeID={item.SkypeID}
                    onHandleCancelBooking={handleCancelBooking}
                    onHandleRequireLesson={handleRequireLesson}
                    lock={lock}
                    cancelable={checkCancelTime(convertDateFromTo(item.ScheduleTimeVN).dateObject)} />)
              }
            </ul>
          </div>
        </div>
        {
          pageSize < totalResult && <Pagination
            innerClass="pagination justify-content-end mt-3"
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={totalResult}
            pageRangeDisplayed={3}
            itemClass="page-item"
            linkClass="page-link"
            onChange={handlePageChange.bind(this)} />
        }
        <RequireLessonModal
          BookingID={stateRequireLesson.BookingID}
          avatar={stateRequireLesson.avatar}
          TeacherUID={stateRequireLesson.TeacherUID}
          TeacherName={stateRequireLesson.TeacherName}
          LessionName={stateRequireLesson.LessionName}
          LessionMaterial={stateRequireLesson.LessionMaterial}
          SpecialRequest={stateRequireLesson.SpecialRequest}
          date={stateRequireLesson.date}
          start={stateRequireLesson.start}
          end={stateRequireLesson.end}
          DocumentName={stateRequireLesson.DocumentName}
          SkypeID={stateRequireLesson.SkypeID}
          callback={cbRequireLesson} />

        <CancelBookingLessonModal
          BookingID={stateCancelLesson.BookingID}
          LessionName={stateCancelLesson.LessionName}
          date={stateCancelLesson.date}
          start={stateCancelLesson.start}
          end={stateCancelLesson.end}
          callback={cbCancelBooking} />

        <PopUpCancelLesson
          LessionName={stateCancelLesson.LessionName}
          date={stateCancelLesson.date}
          start={stateCancelLesson.start}
          end={stateCancelLesson.end}
          reason={stateCancelLesson.reason} />

        <ToastContainer />
      </> : (!loading &&
        <div className="card card-custom shadow">
          <div className="card-body tx-center">
            <span className="d-block text-center tx-danger tx-medium">Đã có lỗi xảy ra, xin vui lòng thử lại</span>
            <img src="../assets/img/error.svg" alt="image" className="wd-200 mg-b-15" />
          </div>
        </div>)
    }
  </>
}

ReactDOM.render(<BookedLesson />, document.getElementById('react-booked-lesson'));