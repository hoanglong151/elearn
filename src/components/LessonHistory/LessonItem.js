import React, { useState } from 'react';
import { Collapse, Table } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { decodeHTML } from '~src/utils';

const LessonItem = ({
	BookingID,
	CoursesName,
	DocumentID,
	DocumentDetailID,
	DocumentName,
	LessionName,
	LessonDetail,
	LessionMaterial,
	start,
	end,
	date,
	TeacherUID,
	TeacherName,
	Status,
	StatusString,
	FileAudio,
	FileAudio1,
	FileAudio2,
	Schedule,
	ListeningPoint,
	ReadingPoint,
	SpeakingPoint,
	WritingPoint,
	StudentEvaluation,
	StudentRate,
	ID,
	Note,
}) => {
	const listFeedBack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const { t, i18n } = useTranslation('common');
	const [open, setOpen] = useState(false);
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
			<tr>
				{/* <div> */}
				<td style={{ letterSpacing: '0.5px' }}>{date}</td>
				<td>{CoursesName}</td>
				<td>{DocumentName}</td>
				<td style={{ whiteSpace: 'pre-line' }}>
					<a
						rel="noreferrer"
						target="_blank"
						href={`https://app.e-learn.com.vn${LessionMaterial}`}
					>
						{LessionName}
					</a>
				</td>
				<td>
					{!!FileAudio && (
						<div className="mg-b-5">
							<span className=" mg-r-5 tx-nowrap">
								<i className="tx-primary"></i> {t('audio-file')} 1:
							</span>
							<span className="tx-gray-500">
								<a rel="noreferrer" target="_blank" href={FileAudio}>
									Download
								</a>
							</span>
						</div>
					)}
					{!!FileAudio1 && (
						<div className="mg-b-5">
							<span className=" mg-r-5 tx-nowrap">
								<i className="tx-primary"></i> {t('audio-file')} 2:
							</span>
							<span className="tx-gray-500">
								<a rel="noreferrer" target="_blank" href={FileAudio1}>
									Download
								</a>
							</span>
						</div>
					)}
					{!!FileAudio2 && (
						<div className="mg-b-5">
							<span className=" mg-r-5 tx-nowrap">
								<i className="tx-primary"></i> {t('audio-file')} 3:
							</span>
							<span className="tx-gray-500">
								<a rel="noreferrer" target="_blank" href={FileAudio2}>
									Download
								</a>
							</span>
						</div>
					)}
				</td>
				<td className="tx-nowrap">
					<a href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}>
						{TeacherName}
					</a>
				</td>
				<td className="tx-nowrap">
					<span className="tx-success">{StatusString}</span>
				</td>
				<td>
					{LessonDetail && LessonDetail.split('ID=')[1] !== '0' && (
						// <a href={LessonDetail} className="btn btn-info btn-icon">
						// 	<i className="fas fa-file-alt mg-r-10"></i>
						// 	{t('detail')}
						// </a>
						<button
							onClick={() => setOpen(!open)}
							aria-controls="example-collapse-text"
							aria-expanded={open}
							className="btn btn-info btn-icon"
						>
							{t('detail')}
						</button>
					)}
				</td>
				{/* </div> */}
			</tr>
			{!!open ? (
				<td colSpan="8">
					<Collapse in={open} style={{ marginTop: 12 }}>
						<div id="example-collapse-text">
							<div className="row">
								<div className="col-md-6 col-sm-12">
									{' '}
									<h5 className="mg-b-0 main-title">
										{t('courseinformation')}
									</h5>
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
											{Note ? (
												<div className="st-item-danhgia tx-gray-500">
													<p
														className="word-break"
														dangerouslySetInnerHTML={{
															__html: decodeHTML(Note),
														}}
													></p>
												</div>
											) : (
												''
											)}
										</div>
										{!!ID ? (
											<div className="st-danhgianguphap ">
												<Table
													striped
													bordered
													hover
													className="wrapper-feedback-detail-teacher wrapper-lesson-history"
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
																		{!!SpeakingPoint &&
																		SpeakingPoint == data ? (
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
				</td>
			) : null}
		</>
	);
};

export default LessonItem;
