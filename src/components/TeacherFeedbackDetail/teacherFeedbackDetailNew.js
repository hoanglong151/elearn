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
import HeaderNoDom from '../HeaderNoDom';
import ProfileSidebarNoDom from '../ProfileSidebarNoDom';
import BottomMenu from '../BottomMenu';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../public/static/locales/en/language.json';
import common_vi from '../../public/static/locales/vi/language.json';
import ProfileSidebarNoDomTeacher from '../ProfileSidebarNoDomTeacher';
import HeaderNoDomTeacher from '../HeaderNoDomTeacher';
import Select from 'react-select';

i18next.init({
	interpolation: { escapeValue: false },
});
i18next.init({
	interpolation: { escapeValue: false },
	lng: 'vi',
	resources: {
		en: {
			common: common_en,
		},
		vi: {
			common: common_vi,
		},
	},
});

const optionsSelect = [
	{ value: 1, label: 'As Schedule' },
	{ value: 2, label: 'Student no show' },
	{ value: 3, label: 'Teacher no show' },
	{ value: 4, label: 'IT problems' },
	{ value: 5, label: 'Teacher late' },
];

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
	const listFeedBack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const { t, i18n } = useTranslation('common');
	const [feedBacks4Skill, setFeedbacks4Skill] = useState({
		FinishedType: null,
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
		NextId: 0,
	});

	const [feedbackDetail, setFeedbackDetail] = useState();
	useEffect(() => {
		var language = window.localStorage.getItem('language');
		if (!!language) {
			if (language.includes('en')) {
				i18next.init({
					interpolation: { escapeValue: false },
					lng: 'en',
					compatibilityJSON: 'v2',
					resources: {
						en: {
							common: common_en,
						},
						vi: {
							common: common_vi,
						},
					},
				});
			} else if (language.includes('vi')) {
				i18next.init({
					interpolation: { escapeValue: false },
					lng: 'vi',
					compatibilityJSON: 'v2',
					resources: {
						en: {
							common: common_en,
						},
						vi: {
							common: common_vi,
						},
					},
				});
			}
		}
	}, []);
	const getFeedbackDetail = async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			if (params.has('ID')) {
				const res = await getTeacherFeedbackDetail({
					BookingID: parseInt(params.get('ID')),
				});
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
						ElearnBookingID: parseInt(params.get('ID')),
					});
				} else {
					setFeedbacks4Skill({
						...feedBacks4Skill,
						...res.Data,
						EvaluationID: parseInt(params.get('ID')),
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

	const handleChangeSelect = (name, value) => {
		console.log('DTAA: ', name, value);
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
		if (!!feedBacks4Skill.Note) {
			if (!!feedBacks4Skill.FinishedType) {
				if (
					feedBacks4Skill.FinishedType == 2 ||
					feedBacks4Skill.FinishedType == 3 ||
					feedBacks4Skill.FinishedType == 4
				) {
					let DATA_SUBMIT = {
						...feedBacks4Skill,
						Note: !!feedBacks4Skill.Note ? feedBacks4Skill.Note : state.note,
						FinishedType: parseInt(feedBacks4Skill.FinishedType),
					};
					try {
						if (
							feedbackDetail.Pronunciation == null &&
							feedbackDetail.Vocabulary == null &&
							feedbackDetail.Grammar == null &&
							feedbackDetail.SentenceDevelopmentAndSpeak == null &&
							feedbackDetail.SpeakingPoint == null &&
							feedbackDetail.ListeningPoint == null &&
							feedbackDetail.ReadingPoint == null &&
							feedbackDetail.WritingPoint == null
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
					} catch (err) {
						console.log('Err: ', err);
					}
				} else if (
					feedBacks4Skill.SpeakingPoint === null ||
					feedBacks4Skill.ListeningPoint === null
				) {
					toast.error("Please rate the student's learning skills");
				} else {
					let DATA_SUBMIT = {
						...feedBacks4Skill,
						Note: !!feedBacks4Skill.Note ? feedBacks4Skill.Note : state.note,
						FinishedType: parseInt(feedBacks4Skill.FinishedType),
					};
					const params = new URLSearchParams(window.location.search);
					console.log('data: ', DATA_SUBMIT, feedbackDetail);
					try {
						if (
							feedbackDetail.Pronunciation == null &&
							feedbackDetail.Vocabulary == null &&
							feedbackDetail.Grammar == null &&
							feedbackDetail.SentenceDevelopmentAndSpeak == null &&
							feedbackDetail.SpeakingPoint == null &&
							feedbackDetail.ListeningPoint == null &&
							feedbackDetail.ReadingPoint == null &&
							feedbackDetail.WritingPoint == null
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
					} catch (err) {
						console.log('Err: ', err);
					}
				}
			} else {
				toast.error('Please select FinishedType');
			}
		} else {
			toast.error(
				'Please write Student’s Performance and Behavior in the Class',
			);
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
			<div className="Header">
				<HeaderNoDomTeacher />
				<BottomMenu />
			</div>
			<div className="wrapper-new">
				<div
					className="ProfileSidebar profile-sidebar-no-dom profilesidebar-show-only-mobile"
					id="js-component-profilesidebar-1"
				>
					<ProfileSidebarNoDomTeacher />
				</div>
				<div className="row wrap-w-100-flex-1">
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
														{/* <span className="">
															{!!feedbackDetail &&
															!!feedbackDetail.FinishedTypeString
																? feedbackDetail.FinishedTypeString
																: ''}
														</span> */}
														<div className="flex-grow-1">
															<Select
																isDisabled={
																	!!feedbackDetail &&
																	(feedbackDetail.Pronunciation != null ||
																		feedbackDetail.Vocabulary != null ||
																		feedbackDetail.Grammar != null ||
																		feedbackDetail.SentenceDevelopmentAndSpeak !=
																			null ||
																		feedbackDetail.SpeakingPoint != null ||
																		feedbackDetail.ListeningPoint != null ||
																		feedbackDetail.ReadingPoint != null ||
																		feedbackDetail.WritingPoint != null)
																}
																value={
																	optionsSelect[
																		optionsSelect.findIndex(
																			item =>
																				item.value ==
																				feedbackDetail?.FinishedType,
																		)
																	]
																}
																onChange={e =>
																	handleChangeSelect('FinishedType', e.value)
																}
																options={optionsSelect}
															/>
														</div>
														{/* <select
															onChange={e =>
																handleChangeSelect(
																	'FinishedType',
																	e.target.value,
																)
															}
															style={{
																padding: '2px',
																borderRadius: '4px',
																border: '1px solid #c0ccda',
															}}
															disabled={
																!!feedbackDetail &&
																feedbackDetail.Pronunciation == null &&
																feedbackDetail.Vocabulary == null &&
																feedbackDetail.Grammar == null &&
																feedbackDetail.SentenceDevelopmentAndSpeak ==
																	null &&
																feedbackDetail.SpeakingPoint == null &&
																feedbackDetail.ListeningPoint == null &&
																feedbackDetail.ReadingPoint == null &&
																feedbackDetail.WritingPoint == null
																	? false
																	: true
															}
														>
															<option
																selected={feedBacks4Skill.FinishedType == 1}
																value="1"
															>
																As Schedule
															</option>
															<option
																selected={feedBacks4Skill.FinishedType == 2}
																value="2"
															>
																Student no show
															</option>
															<option
																selected={feedBacks4Skill.FinishedType == 3}
																value="3"
															>
																Teacher no show
															</option>
															<option
																selected={feedBacks4Skill.FinishedType == 4}
																value="4"
															>
																IT problems
															</option>
															<option
																selected={feedBacks4Skill.FinishedType == 5}
																value="5"
															>
																Teacher late
															</option>
														</select> */}
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
						{/* <button
							onClick={handleSubmitFeedback}
							className="desktop btn btn-icon btn-warning mt-2 w-100"
						>
							<i className="fas fa-save"></i> Save
						</button> */}
					</div>
					<div className="col-xl-9 col-lg-8">
						<div className="row">
							<div className="col-12">
								<div className="card mg-b-15">
									<div className="card-header">
										<h5 className="mg-b-0">
											Student’s Performance and Behavior in the Class{' '}
											<span className="required" style={{ color: 'red' }}>
												*
											</span>
										</h5>
										{/* <div>
											<button
												className="btn btn-icon btn-warning mg-r-15"
												onClick={() => setEditMode(!state.editMode)}
											>
												<i className="fas fa-edit mg-r-5"></i> Edit feedback
											</button>
										</div> */}
									</div>
									<div className="card-body">
										{/* {state.editMode ? (
											<> */}
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
										{/* </>
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
										)} */}
									</div>
								</div>
							</div>
							<div className="col-12">
								<div className="card">
									<div className="card-header">
										<h5 className="mg-b-0">
											Student's learning skills performance
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
															<p className="point">Fully insufficient</p>
															<p className="point-mark">1</p>
														</th>
														<th>
															<p className="point">Poor</p>
															<p className="point-mark">2</p>
														</th>
														<th>
															<p className="point">Very unsatisfactory</p>
															<p className="point-mark">3</p>
														</th>
														<th>
															<p className="point">Unsatisfactory</p>
															<p className="point-mark">4</p>
														</th>
														<th>
															<p className="point">Pass</p>
															<p className="point-mark">5</p>
														</th>
														<th>
															<p className="point">Satisfactory</p>
															<p className="point-mark">6</p>
														</th>
														<th>
															<p className="point">Good</p>
															<p className="point-mark">7</p>
														</th>
														<th>
															<p className="point">Very Good</p>
															<p className="point-mark">8</p>
														</th>
														<th>
															<p className="point">Outstanding</p>
															<p className="point-mark">9</p>
														</th>
														<th>
															<p className="point">Excellent</p>
															<p className="point-mark">10</p>
														</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="title">
															Speaking{' '}
															{feedBacks4Skill.FinishedType != 2 &&
																feedBacks4Skill.FinishedType != 3 &&
																feedBacks4Skill.FinishedType != 4 && (
																	<span className="required">*</span>
																)}
														</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!feedBacks4Skill &&
																	!!feedBacks4Skill.SpeakingPoint &&
																	feedBacks4Skill.SpeakingPoint == data ? (
																		<div
																			onClick={() =>
																				handleChangeSelect(
																					'SpeakingPoint',
																					data,
																				)
																			}
																			className="radio-btn checked"
																		/>
																	) : (
																		<div
																			className="radio-btn"
																			onClick={() =>
																				handleChangeSelect(
																					'SpeakingPoint',
																					data,
																				)
																			}
																		/>
																	)}
																</td>
															);
														})}
													</tr>
													<tr>
														<td className="title">
															Listening
															{feedBacks4Skill.FinishedType != 2 &&
																feedBacks4Skill.FinishedType != 3 &&
																feedBacks4Skill.FinishedType != 4 && (
																	<span className="required">*</span>
																)}
														</td>
														{listFeedBack.map(data => {
															return (
																<td key={data}>
																	{!!feedBacks4Skill &&
																	feedBacks4Skill.ListeningPoint &&
																	feedBacks4Skill.ListeningPoint == data ? (
																		<div
																			onClick={() =>
																				handleChangeSelect(
																					'ListeningPoint',
																					data,
																				)
																			}
																			className="radio-btn checked"
																		/>
																	) : (
																		<div
																			className="radio-btn"
																			onClick={() =>
																				handleChangeSelect(
																					'ListeningPoint',
																					data,
																				)
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
								{!!feedbackDetail &&
								feedbackDetail.Pronunciation == null &&
								feedbackDetail.Vocabulary == null &&
								feedbackDetail.Grammar == null &&
								feedbackDetail.SentenceDevelopmentAndSpeak == null &&
								feedbackDetail.SpeakingPoint == null &&
								feedbackDetail.ListeningPoint == null &&
								feedbackDetail.ReadingPoint == null &&
								feedbackDetail.WritingPoint == null ? (
									<button
										onClick={handleSubmitFeedback}
										className="btn btn-icon btn-warning mr-2 button-next-feedback"
										style={{ backgroundColor: '#fc7e13', color: '#fff' }}
									>
										<i className="fas fa-save"></i> Submit feedback
									</button>
								) : (
									<button
										onClick={handleSubmitFeedback}
										className="btn btn-icon btn-warning mr-2 button-next-feedback"
										style={{ backgroundColor: '#f6da5a', color: '#000' }}
									>
										<i className="fas fa-edit"></i> Edit feedback
									</button>
								)}

								{feedBacks4Skill.NextLink !== '' ? (
									<a
										rel="noopener"
										href={feedBacks4Skill.NextLink}
										className="btn btn-icon btn-warning button-next-feedback"
										style={{ backgroundColor: '#fb7c13', color: '#fff' }}
									>
										<i className="fas fa-arrow-right"></i> Next
									</a>
								) : null}
								<div className="wrapper-note-feedback-detail">
									<p className="notes">Notes:</p>
									<div>
										<ol>
											<li>
												You do not need to put ratings for "Student No Show",
												"Teacher No Show" or "IT Problem" classes
											</li>
											<li>
												<a
													className="link-guide"
													href="https://app.e-learn.com.vn/Upload/Rating_Score_Descriptors_and_Guide.pdf"
													target="_blank"
													rel="noreferrer"
												>
													Rating Score Descriptors and Guide
												</a>
											</li>
										</ol>
									</div>
								</div>
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
			</div>
		</>
	);
};

ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<TeacherFeedbackDetailNew />
	</I18nextProvider>,
	document.getElementById('react-teacher-feedback-detail'),
);
