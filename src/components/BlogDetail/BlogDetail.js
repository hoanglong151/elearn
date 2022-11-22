import React, { useState, useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import SkeletonBlogCard from '~components/common/Skeleton/SkeletonBlogCard'
import { getNotificationDetailAPI } from '~src/api/studentAPI'
import { getFormattedDate } from '~src/utils'

import styles from '~components/BlogDetail/BlogDetail.module.scss'

const BlogDetail = () => {
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(false)

  const getAPI = async (params) => {
    setLoading(true)
    const res = await getNotificationDetailAPI(params)
    if (res.Code === 1) {
      setState(res.Data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let search = window.location.search
    let params = new URLSearchParams(search)
    let ID = params.get('ID')
    getAPI({
      NotificationID: ID,
    });
  }, []);

  return  <div className="media-body">
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb breadcrumb-style1 mg-b-15">
        <li className="breadcrumb-item tx-primary">
          <a href="/ElearnStudent/notification"><i className="fas fa-bell mg-r-5"></i> Notification</a></li>
        {
          !!state && <li className="breadcrumb-item active"
            aria-current="page">{state.NotificationTitle}</li>
        }
      </ol>
    </nav>
    {
      loading ? <SkeletonBlogCard /> : <>
        {
          !!state ? <div className="content-blog pd-15 shadow rounded-5">
            <div className="post-detail-cover">
              <img src={state.NotificationIMG} alt="banner" className="banner-img" />
            </div>
            <div className="post-content">
              <div className="thread_title">
                <span>{state.NotificationTitle}</span>
              </div>
              <div className="author">
                {/* <a href={"#"} className="avatar">
              <img src={state.IMG ? state.IMG : "../assets/img/default-avatar.png"} alt="avatar" />
              </a> */}
                <div className="author-information">
                  <span className="main-color bg-transparent username">
                    <span className="hasVerifiedBadge">{state.CreatedBy}</span></span>
                  <div className="date-comment-view">
                    <span className="date"><span className="DateTime" title={moment(state.CreatedDate).format("LLLL")}>{getFormattedDate(state.CreatedDate)}</span></span>
                  </div>
                </div>
              </div>
              <article dangerouslySetInnerHTML={{ __html: state.NotificationContent }}></article>
            </div>
          </div> :<div className="card card-custom shadow">
            <div className="card-body tx-center">
          <span className="d-block tx-center tx-danger tx-medium">Không có thông báo nào</span>
          <img src="../assets/img/no-booking.svg" alt="image" className="wd-200 mg-b-15" /></div></div>
        } </>
    }
  </div>
}

ReactDOM.render(<BlogDetail />, document.getElementById('react-blog-detail'));