import React, { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
	getEvaluation,
	updateEvaluation,
	getTeacherFeedbackDetail,
	getAddEvaluation,
	getUpdateEvaluation,
} from '~src/api/teacherAPI';
import { randomId } from '~src/utils';
import { appSettings } from '~src/config';
import styles from './teacherFeedbackDetail.module.scss';
import TextareaAutosize from 'react-autosize-textarea';
import { encodeHTML, decodeHTML } from '~src/utils';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';

const initialState = {
	isLoading: true,
	lessonInfo: null,
	note: '',
	grammar: '',
	pronounce: '',
	memorize: '',
	summary: '',
	vocabulary: '',
	finishedType: 0,
	finishedOptions: null,
	submitLoading: false,
	teacherRating: 0,
	editMode: false,
};

const reducer = (prevState, { type, payload }) => {
	switch (type) {
		case 'UPDATE_STATE':
			return {
				...prevState,
				[payload.key]: payload.value,
			};
			break;
		case 'SET_STATE': {
			return {
				...prevState,
				...payload,
			};
			break;
		}
		case 'EDIT_MODE': {
			return {
				...prevState,
				editMode: payload,
			};
			break;
		}
		case 'UPDATE_MODE': {
			console.log('payload: ', payload);
			return {
				...prevState,
				editMode: payload,
			};
			break;
		}
		default:
			break;
	}
};

const StatelessTextarea = props => {
	const [state, setState] = useState(props?.defaultValue ?? '');
	return (
		<TextareaAutosize
			onChange={e => setState(e.target.value)}
			value={state}
			{...props}
		/>
	);
};

const TeacherFeedbackDetailNew = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	console.log('state: ', state);
	const listFeedBack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const [feedBacks4Skill, setFeedbacks4Skill] = useState({
		FinishedType: 0,
		Rate: 0,
		SpeakingPoint: null,
		ListeningPoint: null,
		ReadingPoint: null,
		WritingPoint: null,
		Note: null,
		Pronunciation: null,
		Vocabulary: null,
		Grammar: null,
		SentenceDevelopmentAndSpeak: null,
	});

	const [feedbackDetail, setFeedbackDetail] = useState();
	const getFeedbackDetail = async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.has('BookingID')) {
				const res = await getTeacherFeedbackDetail({
					BookingID: parseInt(params.get('BookingID')),
				});
				console.log('Res: ', res.Data);
				if (
					res.Data.Pronunciation == null &&
					res.Data.Vocabulary == null &&
					res.Data.Grammar == null &&
					res.Data.SentenceDevelopmentAndSpeak == null &&
					res.Data.SpeakingPoint == 0 &&
					res.Data.ListeningPoint == 0 &&
					res.Data.ReadingPoint == 0 &&
					res.Data.WritingPoint == 0
				) {
					setFeedbacks4Skill({
						...feedBacks4Skill,
						...res.Data,
						ElearnBookingID: parseInt(params.get('BookingID')),
					});
				} else {
					setFeedbacks4Skill({
						...feedBacks4Skill,
						...res.Data,
						EvaluationID: parseInt(params.get('BookingID')),
					});
				}
				dispatch({
					type: 'UPDATE_STATE',
					payload: { key: 'note', value: res.Data.Note },
				});
				setFeedbackDetail(res.Data);
			}
		} catch (err) {
			console.log('Err: ', err);
		}
	};

	useEffect(() => {
		getFeedbackDetail();
	}, []);

	console.log('feedbackDetail: ', feedbackDetail);

	const handleChangeSelect = (name, value) => {
		setFeedbacks4Skill({ ...feedBacks4Skill, [name]: value });
	};

	const updateState = (key, value) => {
		dispatch({ type: 'UPDATE_STATE', payload: { key, value } });
		console.log(value);
	};

	const setEditMode = value => {
		if (value) {
			dispatch({ type: 'EDIT_MODE', payload: value });
			updateState('note', feedBacks4Skill.Note);
		} else {
			dispatch({ type: 'EDIT_MODE', payload: value });
			updateState('note', feedBacks4Skill.Note);
		}
	};

	// const getFeedbackDetail = async () => {
	// 	updateState('isLoading', true);
	// 	try {
	// 		const params = getParamsUrl();

	// 		if (!params.has('ID')) return;
	// 		console.log(params.get('ID'));
	// 		const res = await getEvaluation({
	// 			BookingID: parseInt(params.get('ID'), 10),
	// 		});
	// 		res.Code === 1 &&
	// 			dispatch({
	// 				type: 'SET_STATE',
	// 				payload: {
	// 					...res.Data,
	// 					note: decodeURI(res.Data?.Note ?? ''),
	// 					grammar: decodeURI(res.Data?.Grammar ?? ''),
	// 					pronounce: decodeURI(res.Data?.Pronunciation ?? ''),
	// 					memorize: decodeURI(res.Data?.SentenceDevelopmentAndSpeak ?? ''),
	// 					vocabulary: decodeURI(res.Data?.Vocabulary ?? ''),
	// 					finishedType: res.Data?.FinishedTypeString ?? '',
	// 					teacherRating: res.Data?.TeacherRating ?? 0,
	// 				},
	// 			});
	// 	} catch (error) {
	// 		console.log(
	// 			error?.message ?? 'Lỗi gọi api getEvaluation, vui lòng xem lại tham số',
	// 		);
	// 	}
	// 	updateState('isLoading', false);
	// };

	const updateFeedback = async () => {
		updateState('submitLoading', false);
		try {
			const params = getParamsUrl();
			if (!params.has('ID')) return;
			const res = await updateEvaluation({
				EvaluationID: parseInt(params.get('ID'), 10),
				Note: encodeHTML(state?.note) ?? '',
				Pronunciation: encodeHTML(state?.pronounce) ?? '',
				Vocabulary: encodeHTML(state?.vocabulary) ?? '',
				Grammar: encodeHTML(state?.grammar) ?? '',
				SentenceDevelopmentAndSpeak: encodeHTML(state?.memorize) ?? '',
				TeacherRating: state?.teacherRating ?? 0, /// push
			});

			// res.Code === 1 && setEditMode(false);
			// res.Code === 0 && window.location.reload();
		} catch (e) {
			console.log(e);
			alert(
				JSON.stringify(
					res?.Message ??
						'Lỗi khi gọi API update feedback, vui lòng kiểm tra lại !',
				),
			);
		}
		updateState('submitLoading', false);
	};

	const getParamsUrl = () => {
		if (typeof window == undefined) return;
		const params = new URLSearchParams(window.location.search);
		return params;
	};

	// React.useEffect(() => {
	// 	getFeedbackDetail();
	// }, []);

	const handleSubmitFeedback = async () => {
		if (
			feedBacks4Skill.SpeakingPoint === 0 ||
			feedBacks4Skill.ListeningPoint === 0
		) {
			toast.error('Please pick Feedback Speaking And Listening');
		} else {
			let DATA_SUBMIT = {
				...feedBacks4Skill,
				Note: !!feedBacks4Skill.Note ? feedBacks4Skill.Note : state.note,
			};
			const params = new URLSearchParams(window.location.search);
			// if (params.has('BookingID') || params.has('EvaluationID')) {
			// 	const res = await getTeacherFeedbackDetail({
			// 		BookingID:
			// 			parseInt(params.get('BookingID')) ||
			// 			parseInt(params.get('EvaluationID')),
			// 	});
			console.log('data: ', DATA_SUBMIT);
			try {
				if (
					feedbackDetail.Pronunciation == null &&
					feedbackDetail.Vocabulary == null &&
					feedbackDetail.Grammar == null &&
					feedbackDetail.SentenceDevelopmentAndSpeak == null &&
					feedbackDetail.SpeakingPoint == 0 &&
					feedbackDetail.ListeningPoint == 0 &&
					feedbackDetail.ReadingPoint == 0 &&
					feedbackDetail.WritingPoint == 0
				) {
					const res = await getAddEvaluation(DATA_SUBMIT);
					if (res.Code == 1) {
						toast.success(res.Message || 'Thành công');
					}
				} else {
					const res = await getUpdateEvaluation(DATA_SUBMIT);
					if (res.Code == 1) {
						toast.success(res.Message || 'Thành công');
					}
				}
				// 	if (params.has('BookingID')) {
				// 		const res = await getAddEvaluation(DATA_SUBMIT);
				// 		if (res.Code == 1) {
				// 			toast(res.Message || 'Thành công');
				// 		}
				// 	}
				// if (params.has('EvaluationID')) {
				// 	const res = await getUpdateEvaluation(DATA_SUBMIT);
				// 	if (res.Code == 1) {
				// 		toast(res.Message || 'Thành công');
				// 	}
				// }
			} catch (err) {
				console.log('Err: ', err);
			}
		}
	};

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className="row">
				<div className="col-xl-3 col-lg-4">
					<div className="card card-custom lesson-sidebar">
						<div className="card-body">
							<div className="row">
								<div className="col-sm-12 mg-b-15">
									{/* <!--thông tin buổi học--> */}
									<div className="">
										<h5 className="mg-b-15">Lesson information</h5>
										<div className="infomation__wrap">
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<i className="fa fa-book-open tx-primary st-icon wd-20 mg-r-5"></i>
														Course:{' '}
													</span>
													<span className="">
														{!!feedbackDetail && !!feedbackDetail.DocumentName
															? feedbackDetail.DocumentName
															: ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<i className="fa fa-book-reader tx-primary graduate st-icon wd-20 mg-r-5"></i>
														Lesson:
													</span>
													<span className="st-tengv">
														{!!feedbackDetail && !!feedbackDetail.Material
															? feedbackDetail.Material
															: ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="tx-black tx-normal">
														<i className="fa fa-clock tx-primary clock st-icon wd-20 mg-r-5"></i>
														Time:
													</span>
													<span className="">
														{!!feedbackDetail && !!feedbackDetail.ScheduleDate
															? feedbackDetail.ScheduleDate
															: ''}
													</span>
												</p>
											</div>
											<div className="st-time">
												<p className="st-teacher-text d-flex justify-content-between">
													<span className="">
														<i className="fa fa-book tx-primary open st-icon wd-20 mg-r-5"></i>
														Material:
													</span>
													<span>
														<a
															href={
																!!feedbackDetail &&
																!!feedbackDetail.MaterialLink
																	? feedbackDetail.MaterialLink
																	: ''
															}
															target="_blank"
															rel="noreferrer"
														>
															{!!feedbackDetail && !!feedbackDetail.Material
																? feedbackDetail.Material
																: ''}
														</a>
													</span>
												</p>
											</div>
											<div className="st-time">
												<div className="st-teacher-text d-flex justify-content-between align-items-center">
													<span className="">
														<i className="fas fa-lightbulb tx-primary open st-icon wd-20 mg-r-5"></i>
														Finished type:
													</span>
													<span className="">
														{!!feedbackDetail &&
														!!feedbackDetail.FinishedTypeString
															? feedbackDetail.FinishedTypeString
															: ''}
													</span>
												</div>
											</div>
										</div>
									</div>
									{/* <!--/thông tin buổi học--> */}
								</div>
								<div className="col-sm-12 mg-b-15">
									{/* <!--thang danh gia--> */}
									<div className="infomation__wrap">
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											Student Information
										</h5>
										<div className="st-time">
											<p className="st-teacher-text d-flex justify-content-between">
												<span className="">
													<i className="fa fa-user-graduate  tx-primary st-icon wd-20 mg-r-5"></i>
													Name:{' '}
												</span>
												<span className="">
													{!!feedbackDetail && !!feedbackDetail.StudentName
														? feedbackDetail.StudentName
														: ''}
												</span>
											</p>
										</div>
										{/* <div className="st-time">
											<p className="st-teacher-text d-flex justify-content-between">
												<span className="">
													<i className="fa fa-thumbs-up tx-primary st-icon wd-20 mg-r-5"></i>
													Feedback:{' '}
												</span>
												<span className="rating-style">
													{(!!state && !!state.StudentRating
														? state.StudentRating
														: 0) === 0 ? (
														<span className="tx-black">No rating</span>
													) : (
														[...Array(5)].map((el, index) =>
															5 - index <= state.StudentRating ? (
																<i key={`${index}`} className="fas fa-star" />
															) : (
																<i key={`${index}`} className="far fa-star" />
															),
														)
													)}
												</span>
											</p>
										</div> */}
									</div>
								</div>
								<div className="col-sm-12">
									<div>
										<h5 className="mg-b-15 mg-md-t-15 mg-t-15 mg-md-t-0-f">
											Student Feedback
										</h5>
										<span className="word-break">
											{!!feedbackDetail && !!feedbackDetail.StudentNote
												? feedbackDetail.StudentNote
												: ''}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button
						onClick={handleSubmitFeedback}
						className="desktop btn btn-icon btn-warning mt-2 w-100"
					>
						<i className="fas fa-save"></i> Save
					</button>
				</div>
				<div className="col-xl-9 col-lg-8">
					<div className="row">
						<div className="col-12">
							<div className="card mg-b-15">
								<div className="card-header">
									<h5 className="mg-b-0">
										Student’s Performance and Behavior in the Class
									</h5>
									<div>
										<button
											className="btn btn-icon btn-warning mg-r-15"
											onClick={() => setEditMode(!state.editMode)}
										>
											<i className="fas fa-edit mg-r-5"></i> Edit feedback
										</button>
									</div>
								</div>
								<div className="card-body">
									{state.editMode ? (
										<>
											<StatelessTextarea
												rows={3}
												className="form-control"
												placeholder="General feedback......"
												defaultValue={state?.note ?? ''}
												value={feedBacks4Skill.Note}
												onChange={e =>
													setFeedbacks4Skill({
														...feedBacks4Skill,
														Note: e.target.value,
													})
												}
											></StatelessTextarea>
										</>
									) : (
										<>
											<div
												className="mg-t-15"
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.note ? state.note : '',
													),
												}}
											></div>
										</>
									)}
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card">
								<div className="card-header">
									<h5 className="mg-b-0">
										Đánh giá về các kỹ năng trong buổi học
									</h5>
								</div>
								<div className="card-body">
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
																{!!feedBacks4Skill &&
																!!feedBacks4Skill.SpeakingPoint &&
																feedBacks4Skill.SpeakingPoint == data ? (
																	<div
																		onClick={() =>
																			handleChangeSelect('SpeakingPoint', data)
																		}
																		className="radio-btn checked"
																	/>
																) : (
																	<div
																		className="radio-btn"
																		onClick={() =>
																			handleChangeSelect('SpeakingPoint', data)
																		}
																	/>
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
																{!!feedBacks4Skill &&
																feedBacks4Skill.ListeningPoint &&
																feedBacks4Skill.ListeningPoint == data ? (
																	<div
																		onClick={() =>
																			handleChangeSelect('ListeningPoint', data)
																		}
																		className="radio-btn checked"
																	/>
																) : (
																	<div
																		className="radio-btn"
																		onClick={() =>
																			handleChangeSelect('ListeningPoint', data)
																		}
																	/>
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
																{!!feedBacks4Skill &&
																feedBacks4Skill.ReadingPoint &&
																feedBacks4Skill.ReadingPoint == data ? (
																	<div
																		onClick={() =>
																			handleChangeSelect('ReadingPoint', data)
																		}
																		className="radio-btn checked"
																	/>
																) : (
																	<div
																		className="radio-btn"
																		onClick={() =>
																			handleChangeSelect('ReadingPoint', data)
																		}
																	/>
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
																{!!feedBacks4Skill &&
																!!feedBacks4Skill.WritingPoint &&
																feedBacks4Skill.WritingPoint == data ? (
																	<div
																		onClick={() =>
																			handleChangeSelect('WritingPoint', data)
																		}
																		className="radio-btn checked"
																	/>
																) : (
																	<div
																		className="radio-btn"
																		onClick={() =>
																			handleChangeSelect('WritingPoint', data)
																		}
																	/>
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
								</div>
							</div>
							<button
								onClick={handleSubmitFeedback}
								className="tablet btn btn-icon btn-warning mt-3 w-100"
							>
								<i className="fas fa-save"></i> Save
							</button>
						</div>
						{/* <div className="col-12">
							<div className="card  mg-b-15">
								<div className="card-header">
									<h5 className="mg-b-0">Vocabulary</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={3}
													className="form-control"
													placeholder="Vocabulary feedback......"
													defaultValue={state?.vocabulary ?? ''}
													onBlur={e =>
														updateState('vocabulary', e.target.value)
													}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.vocabulary
															? state.vocabulary
															: '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-15">
								<div className="card-header">
									<h5 className="mg-b-0">Pronounce</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={3}
													className="form-control"
													placeholder="Pronounce feedback......"
													defaultValue={state?.pronounce ?? ''}
													onBlur={e => updateState('pronounce', e.target.value)}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.pronounce ? state.pronounce : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="card  mg-b-15">
								<div className="card-header">
									<h5 className="mg-b-0">Sentence Development And Speak</h5>
								</div>
								<div className="card-body">
									<div className="st-danhgianguphap ">
										{state.editMode ? (
											<>
												<StatelessTextarea
													rows={3}
													className="form-control"
													placeholder="Memorize feedback......"
													defaultValue={state?.memorize ?? ''}
													onBlur={e => updateState('memorize', e.target.value)}
												></StatelessTextarea>
											</>
										) : (
											<div
												className=""
												dangerouslySetInnerHTML={{
													__html: decodeHTML(
														!!state && !!state.memorize ? state.memorize : '',
													),
												}}
											></div>
										)}
									</div>
								</div>
							</div>
						</div> */}
					</div>

					{/* <div className="d-flex">
						{state.editMode ? (
							<>
								<button
									type="button"
									className="btn btn-primary d-inline-flex align-items-center mg-r-15"
									disabled={state.submitLoading}
									onClick={updateFeedback}
								>
									{state.submitLoading ? (
										<div
											className="spinner-border wd-20 ht-20 mg-r-5"
											role="status"
										>
											<span className="sr-only">Updating...</span>
										</div>
									) : (
										<>
											<i className="fa fa-save mg-r-5"></i>
										</>
									)}
									<span>
										{state.submitLoading ? 'Updating...' : 'Update feedback'}
									</span>
								</button>
								<button
									className="btn btn-icon btn-light mg-r-15"
									onClick={() => window.location.reload()}
								>
									<i className="fas fa-times mg-r-5"></i> Cancel
								</button>
							</>
						) : (
							<button
								className="btn btn-icon btn-warning mg-r-15"
								onClick={() => setEditMode(true)}
							>
								<i className="fas fa-edit mg-r-5"></i> Edit feedback
							</button>
						)}
					</div> */}
				</div>
			</div>
		</>
	);
};

ReactDOM.render(
	<TeacherFeedbackDetailNew />,
	document.getElementById('react-teacher-feedback-detail'),
);
