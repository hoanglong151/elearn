import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import StudentForm from './StudentForm';
import PurchasedCourseList from './PurchasedCourseList';
import PaymentHistory from './PaymentHistory';
import { ToastContainer } from 'react-toastify';

import styles from '~components/StudentProfile/StudentProfile.module.scss';

const StudentProfile = () => {
	const [showTab, setShowTab] = useState(1);
	return (
		<>
			<div className="teacher__detail__wrap card-box">
				<div className="teacher__detail">
					<div className="teacher-body mg-t-0-f">
						<div className="tab-navigation">
							<ul className="list-tab align-items-stretch" id="js-list-tab">
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 1 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(1);
										}}
									>
										<i className="fas fa-user mg-r-5"></i>THÔNG TIN CÁ NHÂN
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 2 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(2);
										}}
									>
										<i className="fas fa-lock mg-r-5"></i>ĐỔI MẬT KHẨU
									</a>
								</li>
								<li className="tab-item h-auto">
									<a
										href={'#'}
										className={`${
											showTab === 3 ? 'active' : ''
										} tab-link h-100`}
										data-index={0}
										onClick={e => {
											e.preventDefault();
											setShowTab(3);
										}}
									>
										<i className="fas fa-credit-card mg-r-5"></i>LỊCH SỬ THANH
										TOÁN
									</a>
								</li>
							</ul>
						</div>
						<div className="tab-navigation-content">
							<div className="swiper-container" id="js-teacher__info">
								<div className="teacher__info-wrap swiper-wrapper">
									<div
										className={`${
											showTab === 1 || showTab === 2 ? 'active' : ''
										} swiper-slide`}
									>
										<div className="slide-tab-content pd-b-15-f">
											<div className="content-block mg-b-0-f">
												<div className="introduce-content">
													<StudentForm tabDisplay={showTab} />
												</div>
											</div>
										</div>
									</div>
									<div
										className={`${showTab === 3 ? 'active' : ''} swiper-slide`}
									>
										<div className="slide-tab-content pd-b-15-f">
											<div className="payment-tab">
												{showTab === 3 && <PaymentHistory />}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ToastContainer />
			</div>
		</>
	);
};
ReactDOM.render(
	<StudentProfile />,
	document.getElementById('react-student-profile'),
);
