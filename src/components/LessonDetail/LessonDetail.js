import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import SkeletonLessonDetail from '~components/common/Skeleton/SkeletonLessonDetail';
import RatingLessonModal from '~components/RatingLessonModal';
import { getEvaluation } from '~src/api/studentAPI';
import { ToastContainer } from 'react-toastify';
import { decodeHTML } from '~src/utils';

import styles from '~components/LessonDetail/LessonDetail.module.scss';

const renderRatingStars = rate => {
	return rate == 5 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Excellent
		</span>
	) : rate == 4 ? (
		<span className="badge badge-light text-white bg-success mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Good
		</span>
	) : rate == 3 ? (
		<span className="badge badge-light text-white bg-info mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Average
		</span>
	) : rate == 2 ? (
		<span className="badge badge-light text-white bg-warning mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Bad
		</span>
	) : rate == 1 ? (
		<span className="badge badge-light text-white bg-danger mg-l-5">
			<i className="fa fa-check-circle mg-r-3"></i>Very Bad
		</span>
	) : (
		<span className="badge badge-light text-white bg-black-4 mg-l-5">
			Not Rated
		</span>
	);
};

const LessonDetail = () => {
	const [state, setState] = useState({});
	const [loading, setLoading] = useState(false);

	const getAPI = async params => {
		setLoading(true);
		const res = await getEvaluation(params);
		if (res.Code === 1) {
			setState(res.Data);
		}
		setLoading(false);
	};

	const onCallbackRating = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			setState({
				...state,
				StudentEvaluation: message,
				StudentRate: rating,
			});
		}
	};

	useEffect(() => {
		let search = window.location.search;
		let params = new URLSearchParams(search);
		let ID = params.get('ID');
		getAPI({
			ElearnBookingID: ID,
		});
	}, []);

	return (
		<>
			{loading ? (
				<SkeletonLessonDetail />
			) : (
				<>
					<div className="media-body-wrap pd-15 shadow">
						<div className="row">
							<div className="col-md-6 col-sm-12">
								{/* <!--th??ng tin bu???i h???c--> */}
								<div className="st-thontinbuoihoc">
									<h5 className="main-title">Th??ng tin b??i h???c</h5>
									<div className="infomation__wrap">
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fa fa-book st-icon wd-20 mg-r-5"></i>
												<span>
													Kh??a h???c: <span>{state.DocumentName}</span>
												</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-time-text">
												<i className="fa fa-user-clock st-icon wd-20 mg-r-5"></i>
												<span className="tx-black tx-normal">L???ch h???c: </span>
												<span>{state.ScheduleTimeVN}</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span>Gi??o vi??n:</span>{' '}
												<span className="st-tengv">{state.TeacherName}</span>
											</p>
										</div>
										<div className="st-time">
											<p className="st-teacher-text">
												<i className="fa fa-book-open st-icon wd-20 mg-r-5"></i>
												<span>
													T??i li???u:{' '}
													<a
														href={state.MaterialLink}
														target="_blank"
														rel="noreferrer"
													>
														{state.Material}
													</a>{' '}
												</span>
											</p>
										</div>
									</div>
								</div>
								{/* <!--/th??ng tin bu???i h???c--> */}
							</div>
							<div className="col-md-6 col-sm-12">
								{/* <!--thang danh gia--> */}
								<div className="st-thangdanhgia">
									<h5 className="main-title">Ph???n h???i</h5>
									{(state.Rate == 0 || state.Rate) && (
										<div className="d-block mg-b-15 st-rating">
											<div className="cell text-left">
												<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">Gi??o vi??n:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.Rate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.Rate)}
												</div>
											</div>
										</div>
									)}
									{(state.StudentRate == 0 || state.StudentRate) && (
										<div className="d-block st-rating">
											<div className="cell text-left">
												<i className="fas fa-user-graduate st-icon wd-20 mg-r-5"></i>
												<span className="mg-r-5">H???c vi??n:</span>
												<div className="d-inline-block st-noidung-rating">
													<div className="rating-stars">
														<span className="empty-stars">
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
														<span
															className="filled-stars"
															style={{ width: `${state.StudentRate * 20}%` }}
														>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
															<i className="star fa fa-star"></i>
														</span>
													</div>
													{renderRatingStars(state.StudentRate)}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="review__wrap mg-t-15 sec">
							<h5 className="main-title">Nh???n x??t</h5>
							{/*  <!--????nh gi?? gi??o vi??n--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">Teacher???s General Feedback</h5>
								</div>
								{state.Note ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.Note),
											}}
										></p>
									</div>
								) : (
									''
								)}
							</div>
							{/* <!--/????nh gi?? gi??o vi??n-->*/}
							{/* <!--/????nh gi?? ng??? ph??p-->*/}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">Ng??? ph??p</h5>
								</div>
								<div className="row">
									{state.Grammar ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Grammar),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/????nh gi?? ng??? ph??p-->
                      <!--????nh gi?? ph??t ??m--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">Ph??t ??m</h5>
								</div>
								<div className="row">
									{state.Pronunciation ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Pronunciation),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/????nh gi?? ph??t ??m-->
                      <!--????nh gi?? t??? v???ng--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">T??? v???ng</h5>
								</div>
								<div className="row">
									{state.Vocabulary ? (
										<div className="col-12">
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(state.Vocabulary),
													}}
												></p>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>
							{/* <!--/????nh gi?? t??? v???ng-->
                      <!--T??? c???n ghi nh???--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">Ph??t tri???n c??u v?? N??i</h5>
								</div>
								{state.SentenceDevelopmentAndSpeak ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.SentenceDevelopmentAndSpeak),
											}}
										></p>
									</div>
								) : (
									''
								)}
							</div>
							{/* <!--/T??? c???n ghi nh???-->
                   			<!--????nh gi?? h???c vi??n--> */}
							<div className="st-danhgianguphap mg-b-30">
								<div className="st-title-danhgia mg-b-15">
									<h5 className="pd-b-10 bd-b">
										Student???s Feedback on the Lesson
									</h5>
								</div>
								{Object.keys(state).length === 0 ? (
									''
								) : state.StudentEvaluation ? (
									<div className="st-item-danhgia tx-gray-500">
										<p
											className="word-break"
											dangerouslySetInnerHTML={{
												__html: decodeHTML(state.StudentEvaluation),
											}}
										></p>
									</div>
								) : (
									<>
										<p className="tx-danger">
											B???n ch??a ????nh gi?? v??? l???p h???c n??y
										</p>
										<button
											className="btn btn-primary mg-r-10"
											data-toggle="modal"
											data-target="#js-md-rate"
										>
											????nh Gi??
										</button>
									</>
								)}
							</div>
						</div>
						<RatingLessonModal
							BookingID={state.ElearnBookingID}
							TeacherUID={state.TeacherUID}
							TeacherName={state.TeacherName}
							callback={onCallbackRating}
						/>
					</div>
				</>
			)}
			<ToastContainer />
		</>
	);
};

ReactDOM.render(
	<LessonDetail />,
	document.getElementById('react-lesson-detail'),
);
