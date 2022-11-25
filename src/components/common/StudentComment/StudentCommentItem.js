import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from '~components/common/StudentComment/StudentCommentItem.module.scss';
import { decodeHTML } from '~src/utils';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';
import RatingLessonModal from '~components/RatingLessonModal';
import { useTranslation } from 'react-i18next';

const StudentCommentItem = ({
	ScheduleTimeVN,
	TeacherName,
	TeacherIMG,
	TeacherUID,
	Note,
	Rate,
	LinkDetail,
	DocumentName,
	ListeningPoint,
	ReadingPoint,
	SpeakingPoint,
	WritingPoint,
	CreatedDate,
	Evaluation,
	StudentIMG,
	StudentName,
	MaterialLink,
	Material,
	StudentRate,
	StudentEvaluation,
	ID,
}) => {
	const [state, setState] = useState({});
	const { t, i18n } = useTranslation('common');
	const onCallbackRating = (result, message, rating, BookingID, TeacherUID) => {
		if (result === 1) {
			setState({
				...state,
				StudentEvaluation: message,
				StudentRate: rating,
			});
		}
	};

	const listFeedBack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const [open, setOpen] = useState(false);
	return (
		<div className="fb-wrap-item">
			<div className="fb-item">
				<div className="fb-avatar">
					<img
						src={
							!!TeacherIMG
								? TeacherIMG
								: !!StudentIMG
								? StudentIMG
								: '../assets/img/default-avatar.png'
						}
						alt="avatar"
						className="avatar"
						onError={e => {
							e.target.onerror = null;
							e.target.src = '../assets/img/default-avatar.png';
						}}
					/>
				</div>
				<div className="fb-info">
					<div className="name-rating">
						{!!TeacherName ? (
							<a
								className="no-hl"
								href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}
							>
								<p className="name">{TeacherName}</p>
							</a>
						) : !!StudentName ? (
							<p className="name">{StudentName}</p>
						) : (
							''
						)}
						{/* <div className="rating-wrap">
						<div className="rating-stars">
							<span className="empty-stars">
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
							<span className="filled-stars" style={{ width: `${Rate * 20}%` }}>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
								<i className="star fa fa-star"></i>
							</span>
						</div>
					</div> */}
					</div>
					<div className="feedback-comment">
						<p
							className="word-break"
							dangerouslySetInnerHTML={{
								__html: decodeHTML(
									!!Note ? Note : !!Evaluation ? Evaluation : '',
								),
							}}
						></p>
					</div>
					<div className="metas">
						{ScheduleTimeVN ? (
							<div className="meta">
								Time: <span>{ScheduleTimeVN} </span>{' '}
							</div>
						) : CreatedDate ? (
							<div className="meta">
								Time: <span>{moment(CreatedDate).format('LLLL')}</span>{' '}
							</div>
						) : (
							''
						)}
						{DocumentName && <div className="meta">{DocumentName}</div>}
					</div>
					{/* {LinkDetail && (
					<div className="readmore">
						<a href={LinkDetail}>
							Xem chi tiết <i className="fas fa-arrow-right"></i>
						</a>
					</div>
				)} */}
					<div className="readmore">
						<button
							onClick={() => setOpen(!open)}
							aria-controls="example-collapse-text"
							aria-expanded={open}
							className="btn-readmore"
						>
							Xem chi tiết <i className="fas fa-arrow-right"></i>
						</button>
					</div>
				</div>
			</div>
			<Collapse in={open} style={{ marginTop: 12 }}>
				<div id="example-collapse-text">
					<div className="row">
						<div className="col-md-6 col-sm-12">
							{' '}
							<h5 className="mg-b-0 main-title">THÔNG TIN KHÓA HỌC</h5>
							<div className="infomation__wrap">
								<div className="st-time">
									<p className="st-teacher-text">
										<i className="fa fa-book st-icon wd-20 mg-r-5"></i>
										<span>
											Khóa học: <span>{DocumentName}</span>
										</span>
									</p>
								</div>
								<div className="st-time">
									<p className="st-time-text">
										<i className="fa fa-user-clock st-icon wd-20 mg-r-5"></i>
										<span className="tx-black tx-normal">Lịch học: </span>
										<span>{ScheduleTimeVN}</span>
									</p>
								</div>
								<div className="st-time">
									<p className="st-teacher-text">
										<i className="fas fa-chalkboard-teacher st-icon wd-20 mg-r-5"></i>
										<span>Giáo viên:</span>{' '}
										<span className="st-tengv">{TeacherName}</span>
									</p>
								</div>
								<div className="st-time">
									<p className="st-teacher-text">
										<i className="fa fa-book-open st-icon wd-20 mg-r-5"></i>
										<span>
											Tài liệu:{' '}
											<a href={MaterialLink} target="_blank" rel="noreferrer">
												{Material}
											</a>{' '}
										</span>
									</p>
								</div>
							</div>
						</div>
						<div className="col-md-6 col-sm-12">
							<div className="st-thangdanhgia">
								<h5 className="main-title">Phản hồi</h5>
								{(StudentRate == 0 || StudentRate) && (
									<div className="d-block st-rating">
										<div className="cell text-left">
											<i className="fas fa-user-graduate st-icon wd-20 mg-r-5"></i>
											<span className="mg-r-5">Học viên:</span>
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
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="card">
							<div className="card-header">
								<h5 className="mg-b-0 main-title">NHẬN XÉT</h5>
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
															{!!ListeningPoint && ListeningPoint == data ? (
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
									{/* {state.editMode ? (
											<>
												<StatelessTextarea
													rows={3}
													className="form-control"
													placeholder="Grammar feedback......"
													defaultValue={state?.grammar ?? ''}
													onBlur={e => updateState('grammar', e.target.value)}
												></StatelessTextarea>
											</>
										) : (
											<div
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.grammar ? state.grammar : '',
													),
												}}
											></div>
										)} */}
								</div>
								<div className="mg-b-30 mg-t-30">
									<div className="st-title-danhgia mg-b-15">
										<h5 className="pd-b-10 bd-b">
											{t('student’sfeedbackaboutthelesson')}
										</h5>
									</div>
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
											<p className="tx-danger">
												Bạn chưa đánh giá về lớp học này
											</p>
											<button
												className="btn btn-primary mg-r-10"
												data-toggle="modal"
												data-target="#js-md-rate"
												// onClick={handleOpen}
											>
												Đánh Giá
											</button>
											<RatingLessonModal
												BookingID={ID}
												TeacherUID={TeacherUID}
												TeacherName={TeacherName}
												callback={onCallbackRating}
											/>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Collapse>
		</div>
	);
};

export default StudentCommentItem;
