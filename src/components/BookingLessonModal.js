import React, { useState, useEffect, useReducer, forwardRef } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import { toastInit } from '~src/utils';
import { bookingLessonAPI, getLessonBookAPI } from '~src/api/studentAPI';
import { FETCH_ERROR, MAX_200 } from '~components/common/Constant/toast';

import styles from '~components/BookingLessonModal.module.scss';

const BookingLessonModal = (
	{
		style,
		StudyTimeID,
		LessionName = '',
		LessionMaterial = '',
		TeacherUID,
		TeacherIMG = 'default-avatar.png',
		TeacherName,
		Rate,
		date,
		start,
		end,
		note = '',
		DocumentName = '',
		BookingID,
		onBook,
	},
	ref,
) => {
	const [state, setState] = useState('');
	const [bookState, setBookState] = useState(null);
	const bookingToastFail = () => toast.error(FETCH_ERROR, toastInit);
	const bookingToastFail2 = text => toast.error(text, toastInit);
	const requireLessonAlert = () => toast.warn(MAX_200, toastInit);

	const fetchAPI = async params => {
		const res = await bookingLessonAPI(params);
		if (res.Code === 1)
			onBook && onBook(TeacherUID, StudyTimeID, date, res.Code);
		else if (!!res && res.Message) bookingToastFail2(res.Message);
		else bookingToastFail();
	};

	const getLessonToBookingAPI = async () => {
		const res = await getLessonBookAPI({ StudyTimeID, Date: date });
		if (res.Code === 1) {
			setBookState({
				...res.Data,
				Code: 1,
			});
		} else if (res.Code === 0) {
			setBookState({
				Message: res.Message,
				Code: 0,
			});
		}
	};

	const handleBookingLesson = () => {
		if (state.length > 200) {
			requireLessonAlert();
		} else {
			fetchAPI({
				TeacherUID,
				Date: date,
				StudyTimeID,
				DocumentID: bookState.DocumentID,
				DocumentDetailID: bookState.ID,
				SpecialRequest: state,
			});
			$('#md-book-schedule').fadeOut(500, function() {
				$('#md-book-schedule').modal('hide');
			});
		}
	};

	useEffect(() => {
		getLessonToBookingAPI();
		console.log('test 1');
		setState('');
		feather.replace();
	}, [TeacherUID, parseInt(StudyTimeID) ?? 0, date]);

	// useEffect(() => {
	// 	console.log('test 2');
	// 	getLessonToBookingAPI();
	// }, []);

	return !!bookState ? (
		bookState.Code === 0 ? (
			<div
				className="modal fade effect-scale"
				id="md-book-schedule"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="active-slot"
				aria-hidden="true"
			>
				<div
					className="modal-dialog modal-dialog-centered modal-sm"
					role="document"
				>
					<div className="modal-content">
						<div className="modal-header bg-danger">
							<h5 className="modal-title tx-white">Warning</h5>
							<button
								type="button"
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
								<span className="tx-white" aria-hidden="true">
									&times;
								</span>
							</button>
						</div>
						<div className="modal-body">
							<p className="tx-danger">{bookState.Message}</p>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-primary"
								data-dismiss="modal"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		) : (
			<div
				className="modal effect-scale"
				tabIndex="-1"
				role="dialog"
				id="md-book-schedule"
				ref={ref}
			>
				<div
					className="modal-dialog modal-dialog-centered modal-lg"
					role="document"
				>
					<div className="modal-content">
						<form action="" className="">
							<div className="modal-body">
								<div className="cr-item lesson-info">
									<div className="media">
										<div className="teacher-information">
											<a
												className="teacher-avatar"
												href={`teacherDetail?ID=${TeacherUID}`}
											>
												<img
													src={
														TeacherIMG === 'default-avatar.png'
															? `../assets/img/${TeacherIMG}`
															: TeacherIMG
													}
													className="teacher-image"
													alt=""
													onError={e => {
														e.target.onerror = null;
														e.target.src = '../assets/img/default-avatar.png';
													}}
												/>
												<p className="course-teacher tx-14 tx-gray-800 tx-normal mg-b-0 tx-center mg-t-5 d-block">
													{TeacherName}
												</p>
											</a>
										</div>
										<div className="media-body  mg-l-20 pos-relative pd-b-0-f">
											<h5 className="mg-b-10 d-flex align-items-center">
												<span className="badge badge-warning mg-r-5">
													Incoming
												</span>{' '}
												<span className="no-hl course-name tx-bold">
													{bookState.LessionName}
												</span>
											</h5>
											<div className="course-information tx-14">
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="calendar"
													></i>
													{date}
												</span>
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="clock"
													></i>
													{`B???t ?????u: ${start}`}
												</span>
												<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
													<i
														className="feather-16 mg-r-5"
														data-feather="clock"
													></i>
													{`K???t th??c: ${end}`}
												</span>
											</div>
											{/*
                        note && <div className="course-note mg-t-15">
                          <h6 className="mg-b-3">Lesson notes:</h6>
                          <p className="tx-14 mg-b-0">{note}</p>
                        </div>
                      */}
											{/*
                        DocumentName && <div className="course-docs mg-t-15">
                          <h6 className="mg-b-3">Documents:</h6>
                          <div>
                            <a href={LessionMaterial} target="_blank">{DocumentName}</a>
                          </div>
                        </div>
                      */}
											<div className="required-list mg-t-15 bd-t pd-t-15">
												<div className="required-text-box metronic-form">
													<label className="tx-medium">
														Ghi ch?? cho gi??o vi??n:
													</label>
													<label className="tx-danger d-block">
														Vui l??ng vi???t b???ng Ti???ng Anh (t???i ??a 200 k?? t???)
													</label>
													<div className="form-group mg-b-5-f">
														<textarea
															name="message"
															rows="4"
															className="form-control"
															placeholder="N???i dung..."
															value={state}
															onChange={e => setState(e.target.value)}
														></textarea>
													</div>
													<label className="text-right d-block">
														{`${
															state.length > 0
																? `B???n ???? nh???p ${state.length} k?? t???`
																: '*'
														}`}
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-light"
									data-dismiss="modal"
								>
									????ng
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleBookingLesson}
								>
									????ng k??
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	) : (
		<div
			className="modal fade effect-scale"
			id="md-book-schedule"
			tabIndex="-1"
			role="dialog"
			aria-labelledby="active-slot"
			aria-hidden="true"
		>
			<div
				className="modal-dialog modal-dialog-centered modal-sm"
				role="document"
			>
				<div className="modal-content">
					<div className="modal-header bg-danger">
						<h5 className="modal-title tx-white">Warning</h5>
						<button
							type="button"
							className="close"
							data-dismiss="modal"
							aria-label="Close"
						>
							<span className="tx-white" aria-hidden="true">
								&times;
							</span>
						</button>
					</div>
					<div className="modal-body">
						<p className="tx-danger">???? c?? l???i x???y ra, xin vui l??ng th??? l???i</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-primary"
							data-dismiss="modal"
						>
							????ng
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default forwardRef(BookingLessonModal);
