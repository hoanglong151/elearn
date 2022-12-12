import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import styles from '~components/LessonHistoryCard.module.scss';
import { useTranslation } from 'react-i18next';
import { Collapse, Table } from 'react-bootstrap';
import RatingLessonModal from './RatingLessonModal';
import { decodeHTML } from '~src/utils';

const LessonHistoryCard = ({
	onHandleRatingLesson,
	BookingID,
	avatar = 'default-avatar.png',
	TeacherUID,
	TeacherName,
	LessionName,
	Status,
	note = '',
	start,
	end,
	date,
	Rate,
	ListeningPoint,
	ReadingPoint,
	SpeakingPoint,
	WritingPoint,
	DocumentName,
	Schedule,
	LessionMaterial,
	StudentRate,
	StudentEvaluation,
	ID,
}) => {
	const listFeedBack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const [open, setOpen] = useState(false);
	const handleRatingLesson = (BookingID, TeacherUID, TeacherName) => {
		onHandleRatingLesson(BookingID, TeacherUID, TeacherName);
	};
	const { t, i18n } = useTranslation('common');

	useEffect(() => {
		feather.replace();
	}, []);

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

	return (
		<>
			<li className="cr-item lesson-history lesson-info">
				<div className="media">
					<div className="teacher-information">
						<a
							className="teacher-avatar"
							href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
						>
							<img
								src={
									avatar === 'default-avatar.png'
										? `../assets/img/${avatar}`
										: avatar
								}
								className="teacher-image"
								alt="Avatar"
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
					<div className="media-body mg-l-20 pos-relative">
						<div>
							<h5 className="mg-b-10 mg-t-10 mg-sm-t-0">
								<span className="badge badge-success">{t('finish')}</span>{' '}
								{/* <a
									href={`/ElearnStudent/lessonDetail?ID=${BookingID}`}
									className="no-hl course-name tx-bold"
								>
									{LessionName}
								</a> */}
								<button
									onClick={() => setOpen(!open)}
									aria-controls="example-collapse-text"
									aria-expanded={open}
									className="btn-readmore btn-readmore-title px-0"
								>
									{LessionName}
								</button>
							</h5>
							<div className="course-information tx-14">
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="calendar"></i>
									{date}
								</span>
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="clock"></i>
									{`${t('start')}: ${start}`}
								</span>
								<span className="mg-r-15 tx-gray-600 tx-medium d-inline-block">
									<i className="feather-16 mg-r-5" data-feather="clock"></i>
									{`${t('end')}: ${end}`}
								</span>
							</div>
							{note && (
								<div className="course-note mg-t-15">
									<h6 className="mg-b-3 tx-bold">{t('notestoteacher')}:</h6>
									<p className="tx-14 mg-b-0">{note}</p>
								</div>
							)}
							{/* <div className="course-rate">
								<h6 className="tx-bold text-feedback-course">
									{t('evaluate-the-lesson')}:
								</h6>
								<div className="rating-wrap">
									{Status === 3 || Status === 4 ? (
										<span className="tx-danger tx-medium mg-t-15">
											{t('classcancel')}.
										</span>
									) : null}

									!!ID ? (
										<>
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
													style={{ width: `${Rate * 20}%` }}
												>
													<i className="star fa fa-star"></i>
													<i className="star fa fa-star"></i>
													<i className="star fa fa-star"></i>
													<i className="star fa fa-star"></i>
													<i className="star fa fa-star"></i>
												</span>
											</div>
										</>
									) : (
										<></>
									)}
								</div>
							</div> */}
							{Status === 3 || Status === 4 ? (
								<></>
							) : (
								<div className="readmore">
									<button
										onClick={() => setOpen(!open)}
										aria-controls="example-collapse-text"
										aria-expanded={open}
										className="btn-readmore px-0 pt-2"
									>
										{t('view-details')} <i className="fas fa-arrow-right"></i>
									</button>
								</div>
							)}

							{/* !!ID ? (
								<div className="readmore">
									<button
										onClick={() => setOpen(!open)}
										aria-controls="example-collapse-text"
										aria-expanded={open}
										className="btn-readmore px-0 pt-2"
									>
										{t('view-details')} <i className="fas fa-arrow-right"></i>
									</button>
								</div>
							) : (
								<button
									type="button"
									className="btn-rate-now"
									data-toggle="modal"
									data-target={`#js-md-rate-${BookingID}`}
									onClick={() =>
										handleRatingLesson(BookingID, TeacherUID, TeacherName)
									}
								>
									{t('leavereview')}!
								</button>
							)} */}
						</div>
					</div>
				</div>
				<Collapse in={open} style={{ marginTop: 12 }}>
					<div id="example-collapse-text">
						<div className="row">
							<div className="col-md-6 col-sm-12">
								{' '}
								<h5 className="mg-b-0 main-title">{t('courseinformation')}</h5>
								<div className="infomation__wrap">
									<div className="st-time">
										<p className="st-teacher-text">
											<i className="fa fa-book st-icon wd-20 mg-r-5"></i>
											<span>
												{t('courseplan')}: <span>{DocumentName}</span>
											</span>
										</p>
									</div>
									<div className="st-time">
										<p className="st-time-text">
											<i className="fa fa-user-clock st-icon wd-20 mg-r-5"></i>
											<span className="tx-black tx-normal">
												{t('lessonschedule')}:{' '}
											</span>
											<span>{Schedule}</span>
										</p>
									</div>
									<div className="st-time">
										<p className="st-teacher-text">
											<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
											<span>{t('teacher')}:</span>{' '}
											<span className="st-tengv">{TeacherName}</span>
										</p>
									</div>
									<div className="st-time">
										<p className="st-teacher-text">
											<i className="fa fa-book-open st-icon wd-20 mg-r-5"></i>
											<span>
												{t('document')}:{' '}
												<a
													href={LessionMaterial}
													target="_blank"
													rel="noreferrer"
												>
													{LessionName}
												</a>{' '}
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<h5 className="mg-b-0 main-title">{t('nhanxet')}</h5>
								</div>
								<div className="card-body">
									<div className="mg-b-30">
										<div className="st-title-danhgia mg-b-15">
											<h5 className="pd-b-10 bd-b">
												{t('teachers-general-feedback')}
											</h5>
										</div>
									</div>
									{!!ID ? (
										<div className="st-danhgianguphap ">
											<Table
												striped
												bordered
												hover
												className="wrapper-feedback-detail-teacher"
											>
												<thead>
													<tr>
														<th></th>
														<th>
															<p className="point">1</p>
															<p>Fully insufficient</p>
														</th>
														<th>
															<p className="point">2</p>
															<p>Poor</p>
														</th>
														<th>
															<p className="point">3</p>
															<p>Very unsatisfactory</p>
														</th>
														<th>
															<p className="point">4</p>
															<p>Unsatisfactory</p>
														</th>
														<th>
															<p className="point">5</p>
															<p>Pass</p>
														</th>
														<th>
															<p className="point">6</p>
															<p>Satisfactory</p>
														</th>
														<th>
															<p className="point">7</p>
															<p>Good</p>
														</th>
														<th>
															<p className="point">8</p>
															<p>Very Good</p>
														</th>
														<th>
															<p className="point">9</p>
															<p>Outstanding</p>
														</th>
														<th>
															<p className="point">10</p>
															<p>Excellent</p>
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="title">
															Speaking <span className="required">*</span>
														</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!SpeakingPoint && SpeakingPoint == data ? (
																		<div className="radio-btn checked" />
																	) : (
																		<div className="radio-btn" />
																	)}
																</td>
															);
														})}
													</tr>
													<tr>
														<td className="title">
															Listening <span className="required">*</span>
														</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!ListeningPoint &&
																	ListeningPoint == data ? (
																		<div className="radio-btn checked" />
																	) : (
																		<div className="radio-btn" />
																	)}
																</td>
															);
														})}
													</tr>
													<tr>
														<td className="title">Reading</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!ReadingPoint && ReadingPoint == data ? (
																		<div className="radio-btn checked" />
																	) : (
																		<div className="radio-btn" />
																	)}
																</td>
															);
														})}
													</tr>
													<tr>
														<td className="title">Writing</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!WritingPoint && WritingPoint == data ? (
																		<div className="radio-btn checked" />
																	) : (
																		<div className="radio-btn" />
																	)}
																</td>
															);
														})}
													</tr>
												</tbody>
											</Table>
										</div>
									) : (
										<p className="text-danger font-weight-bold">
											Giáo viên chưa đánh giá
										</p>
									)}

									<div className="mg-b-30 mg-t-30">
										<div className="st-title-danhgia mg-b-15">
											<h5 className="pd-b-10 bd-b main-title">
												{t('student’sfeedbackaboutthelesson')}
											</h5>
										</div>
										{(StudentRate == 0 || StudentRate) && (
											<div className="d-block st-rating mg-b-15">
												<div className="cell text-left">
													<i className="fas fa-user-graduate st-icon wd-20 mg-r-5"></i>
													<span className="mg-r-5">{t('student')}:</span>
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
																style={{ width: `${StudentRate * 20}%` }}
															>
																<i className="star fa fa-star"></i>
																<i className="star fa fa-star"></i>
																<i className="star fa fa-star"></i>
																<i className="star fa fa-star"></i>
																<i className="star fa fa-star"></i>
															</span>
														</div>
														{renderRatingStars(StudentRate)}
													</div>
												</div>
											</div>
										)}
										{!!StudentEvaluation ? (
											<div className="st-item-danhgia tx-gray-500">
												<p
													className="word-break"
													dangerouslySetInnerHTML={{
														__html: decodeHTML(StudentEvaluation),
													}}
												></p>
											</div>
										) : (
											<>
												<p className="tx-danger">{t('dontfeedback')}</p>
												<button
													className="btn btn-primary mg-r-10"
													data-toggle="modal"
													data-target={`#js-md-rate-${BookingID}`}
												>
													{t('rating')}
												</button>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Collapse>
			</li>
		</>
	);
};

export default LessonHistoryCard;
