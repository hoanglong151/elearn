import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SkeletonFaq from "~components/common/Skeleton/SkeletonFaq";
import { getFaqAPI } from "~src/api/studentAPI";

const Faq = () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAPI = async () => {
    setLoading(true);
    const res = await getFaqAPI();
    if (res.Code === 1) {
      setState(res.Data)
    }
    setLoading(false);
  }

  useEffect(() => {
    getAPI();
  }, []);

  return <>
    <div className="faq-container">
      <div className="d-xl-flex align-items-center justify-content-between mg-b-15">
        <h4 className="mg-b-0 gradient-heading"><i className="fas fa-comment-alt"></i>CÁC CÂU HỎI THƯỜNG GẶP</h4>
      </div>
      {
        loading ? <SkeletonFaq /> :
          <div id="accordion">
            {
              !!state && state.length > 0 ? state.map((item, index) =>
                <div className="card" key={item.ID}>
                  <div className="card-header" id={item.ID}>
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed"
                        data-toggle="collapse"
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        data-target={`#collapse${item.ID}`}
                        aria-controls={`collapse${item.ID}`}>
                        {item.Title}
                      </button>
                    </h5>
                  </div>
                  <div
                    data-parent="#accordion"
                    id={`collapse${item.ID}`}
                    className={`${index === 0 ? 'show' : ''} collapse`}
                    aria-labelledby={item.ID} >
                    <div className="card-body" dangerouslySetInnerHTML={{ __html: item.FaqContent }}>
                    </div>
                  </div>
                </div>
              ):
              <div className="card card-custom shadow">
              <div className="card-body tx-center">
            <span className="d-block tx-center tx-danger tx-medium">Không có câu hỏi nào</span>
            <img src="../assets/img/no-booking.svg" alt="image" className="wd-200 mg-b-15" /></div></div>
            }
          </div>
      }
    </div>
  </>
}

ReactDOM.render(<Faq />, document.getElementById('react-faq'));