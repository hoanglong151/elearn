import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import StudentCommentItem from '~components/common/StudentComment/StudentCommentItem';
import SkeletonFeedback from '~components/common/Skeleton/SkeletonFeedback';
import Pagination from 'react-js-pagination';
import Flatpickr from 'react-flatpickr';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import common_en from '../../public/static/locales/en/language.json';
import common_vi from '../../public/static/locales/vi/language.json';

import { getFeedbackOverviewAPI } from '~src/api/studentAPI';
import {
	getListEvaluationAPI,
	getListEvaluation,
	getSkillInfo,
	getScheduleInfo,
} from '~src/api/studentAPI';

import styles from '~components/FeedbackNew/FeedbackNew.module.scss';
import Select, { components } from 'react-select';
import { appSettings } from '~src/config';
import ChartEverageSkill from './ChartEverageSkill';
import ChartSchedule from './ChartSchedule';
import HeaderNoDom from '../HeaderNoDom';
import ProfileSidebarNoDom from '../ProfileSidebarNoDom';

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

// const FeedbackOption = props => {
// 	const { data, children } = props;
// 	const numberStar = parseInt(data.value);
// 	return (
// 		<components.Option {...props}>
// 			<div className="d-flex justify-content-between align-items-center">
// 				{numberStar > 0 ? (
// 					<>
// 						<span>
// 							{[...Array(numberStar)].map((item, index) => {
// 								return (
// 									<i key={`${index}`} className="fas fa-star tx-warning"></i>
// 								);
// 							})}
// 						</span>
// 						<span>({data.count})</span>
// 					</>
// 				) : (
// 					<>
// 						<span>{t('all-feedback')}</span>
// 						<span>({data.count})</span>
// 					</>
// 				)}
// 			</div>
// 		</components.Option>
// 	);
// };

const FeedbackNew = () => {
	const [overview, setOverview] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingListEvaluation, setLoadingListEvaluation] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState([]);
	const [toDate, setToDate] = useState([]);
	const { t, i18n } = useTranslation('common');
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
	const _onFilterDate = async e => {
		e.preventDefault();
		let res;
		const DateTimeFormat = new Intl.DateTimeFormat('fr-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		try {
			if (fromDate.length > 0 && toDate.length > 0) {
				let DATA_SUBMIT = {
					fromDate: DateTimeFormat.format(new Date(fromDate)),
					toDate: DateTimeFormat.format(new Date(toDate)),
				};
				res = await getListEvaluation({
					FromDate: DATA_SUBMIT.fromDate,
					ToDate: DATA_SUBMIT.toDate,
					Page: 1,
				});
			} else if (fromDate.length > 0 && toDate.length == 0) {
				let DATA_SUBMIT = {
					fromDate: DateTimeFormat.format(new Date(fromDate)),
				};
				res = await getListEvaluation({
					FromDate: DATA_SUBMIT.fromDate,
					ToDate: DateTimeFormat.format(new Date()),
					Page: 1,
				});
			} else if (fromDate.length == 0 && toDate.length > 0) {
				let DATA_SUBMIT = {
					toDate: DateTimeFormat.format(new Date(toDate)),
				};
				res = await getListEvaluation({
					FromDate: DateTimeFormat.format(new Date()),
					ToDate: DATA_SUBMIT.toDate,
					Page: 1,
				});
			} else {
				res = await getListEvaluation({ Page: 1 });
			}
			setListFeedback(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
			setPage(1);
		} catch (err) {
			console.log('Err: ', err);
		}
		// loadAllClassesData();
	};
	const [filterOption, setFilterOption] = useState({
		label: 'Tất cả đánh giá',
		value: '0',
		count: overview.AllEvaluation,
	});
	const [feedback, setFeedback] = useState([]);
	const [rate, setRate] = useState(0);

	// Fake data Feedback
	// {
	// 		ID: 52612,
	// 		TotalRow: 51,
	// 		TeacherUID: 63740,
	// 		TeacherName: 'Hồng  Nghi Nancy',
	// 		TeacherIMG:
	// 			'http://app.e-learn.com.vn/Upload/imageform/02771682-cf91-421c-a9d1-703042f61713993DPA681LFBIQK6UIMSMWAT9JANKI6ZRJ9X4L0H.png',
	// 		DocumentName: 'Everybody Up',
	// 		ScheduleTimeVN: '08/10/2022 19:00 - 19:25',
	// 		Note:
	// 			'con thông minh, rất năng lượng và tích cực trong buổi học, ngoan và nhạy bén, chăm chỉ thực hành theo hướng dẫn của cô trong buổi học, tương tác tốt với giáo viên. Con hoàn thành xuất sắc buổi học hôm nay, tiếp nhận và phản hồi tốt một số câu hỏi thông dụng từ cô. Con nắm bài rất tốt về các từ vựng, mẫu câu trong bài và tự vận dụng đặt câu khá tốt. Con thực hành phát âm tương đối ổn, chú ý cách phát âm mạo từ "the" trước các danh từ bắt đầu bằng nguyên âm con nhé (the afternoon, the evening). Chú ý phát âm các từ sau: fire, makes, these,....',
	// 		SpeakingPoint: 2,
	// 		ListeningPoint: 3,
	// 		ReadingPoint: 1,
	// 		WritingPoint: 9,
	// 		Material: 'EVERYBODY UP 3 3_123 People In Town Lesson 2',
	// 		MaterialLink: '/Upload/exercise/3aa9ad0e-f46b-4a3a-951a-6ccc56935190.pdf',
	// 		StudentRate: 4,
	// 		StudentEvaluation: null,
	// 	},

	const [listFeedback, setListFeedback] = useState([]);
	const [detailStatisticSkill, setDetailStatisticSkill] = useState();
	const [detailStatisticSchedule, setDetailStatisticSchedule] = useState();

	const getAllFeedback = async params => {
		try {
			const res = await getListEvaluation(params);
			if (res.Code == 1) {
				setListFeedback(res.Data);
				setPageSize(res.PageSize);
				setTotalResult(res.TotalResult);
			}
			setPage(params.Page);
		} catch (err) {
			console.log('Err: ', err);
		}
	};

	const getDetailStatisticSkill = async () => {
		try {
			const res = await getSkillInfo();
			if (res.Code == 1) {
				setDetailStatisticSkill(res.Data);
			}
		} catch (err) {
			console.log('Err: ', err);
		}
	};

	const getDetailStatisticSchedule = async () => {
		try {
			const res = await getScheduleInfo();
			if (res.Code == 1) {
				setDetailStatisticSchedule(res.Data);
			}
		} catch (err) {
			console.log('Err: ', err);
		}
	};

	useEffect(() => {
		getAllFeedback({ Page: 1 });
		getDetailStatisticSkill();
		getDetailStatisticSchedule();
	}, []);

	const handlePageChange = pageNumber => {
		const DateTimeFormat = new Intl.DateTimeFormat('fr-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		if (page !== pageNumber) {
			setPage(pageNumber);
			getAllFeedback({
				Page: pageNumber,
				FromDate:
					!!fromDate.length > 0
						? DateTimeFormat.format(new Date(fromDate))
						: '',
				ToDate:
					!!toDate.length > 0 ? DateTimeFormat.format(new Date(toDate)) : '',
			});
		}
	};

	const getOverViewAPI = async () => {
		setLoading(true);
		const res = await getFeedbackOverviewAPI();
		if (res.Code === 1) {
			setOverview(res.Data);
		}
		setLoading(false);
	};

	// const _GetListEvaluationAPI = async params => {
	// 	setLoadingListEvaluation(true);
	// 	const res = await getListEvaluationAPI(params);
	// 	if (res.Code === 1) {
	// 		setFeedback(res.Data);
	// 		setPageSize(res.PageSize);
	// 		setTotalResult(res.TotalResult);
	// 	}
	// 	setPage(params.Page);
	// 	setLoadingListEvaluation(false);
	// };

	// const fetchListEvaluation = e => {
	// 	let rateFilter = parseInt(e.target.value);
	// 	if (rateFilter === rate) return;
	// 	setRate(rateFilter);
	// 	_GetListEvaluationAPI({
	// 		Rate: rateFilter,
	// 		Page: 1,
	// 	});
	// };

	// useEffect(() => {
	// 	_GetListEvaluationAPI({
	// 		Rate: parseInt(filterOption?.value) ?? 0,
	// 		Page: 1,
	// 	});
	// }, [filterOption]);

	useEffect(() => {
		getOverViewAPI();
	}, []);

	return (
		<>
			<div className="Header">
				<HeaderNoDom />
			</div>
			<div className="wrapper-new">
				<div
					className="ProfileSidebar profile-sidebar-no-dom"
					id="js-component-profilesidebar-1"
				>
					<ProfileSidebarNoDom />
				</div>
				<div className="wrapper-w-by-desktop">
					{!loading && (
						<>
							<div className="d-sm-flex align-items-center justify-content-between">
								<h4 className="mg-b-0 gradient-heading">
									<i className="fas fa-comment-dots"></i>
									{t('teacher’sfeedback')}
								</h4>
								{overview && Object.keys(overview).length > 0 && (
									<div className="form-group d-inline-block wd-200 mg-b-0-f mg-t-15 mg-sm-t-0-f">
										{/* <Select
											components={{ Option: FeedbackOption }}
											value={filterOption}
											onChange={value => setFilterOption(value)}
											styles={appSettings.selectStyle}
											options={[
												{
													label: 'Tất cả đánh giá',
													value: '0',
													count: overview.AllEvaluation,
												},
												{
													label: '5 Stars',
													count: overview.EvaluationRate5,
													value: '5',
												},
												{
													label: '4 Stars',
													count: overview.EvaluationRate4,
													value: '4',
												},
												{
													label: '3 Stars',
													count: overview.EvaluationRate3,
													value: '3',
												},
												{
													label: '2 Stars',
													count: overview.EvaluationRate3,
													value: '2',
												},
												{
													label: '1 Stars',
													count: overview.EvaluationRate3,
													value: '1',
												},
											]}
											getOptionLabel={option => option.label}
											getOptionValue={option => option.value}
										/> */}
										{/* <select
									className="form-control main-color bg-white"
									style={{ fontFamily: 'FontAwesome' }}
									onChange={fetchListEvaluation}
								>
									<option value="0">Tất cả ({overview.AllEvaluation})</option>
									<option value="5">
										&#xf005; &#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate5})
									</option>
									<option value="4">
										&#xf005; &#xf005; &#xf005; &#xf005; (
										{overview.EvaluationRate4})
									</option>
									<option value="3">
										&#xf005; &#xf005; &#xf005; ({overview.EvaluationRate3})
									</option>
									<option value="2">
										&#xf005; &#xf005; ({overview.EvaluationRate2})
									</option>
									<option value="1">
										&#xf005; ({overview.EvaluationRate1})
									</option>
								</select> */}
									</div>
								)}
							</div>
							<div className="wrapper-chart">
								<div className="chart">
									<h4 style={{ marginBottom: 16 }}>
										{t('everage-learing-performance-chart')}
									</h4>
									<ChartEverageSkill
										detailStatisticSkill={detailStatisticSkill}
									/>
								</div>
								<div className="chart">
									<h4 style={{ marginBottom: 16 }}>
										{t('lesson-booking-progress')}
									</h4>
									<ChartSchedule
										detailStatisticSchedule={detailStatisticSchedule}
									/>
								</div>
							</div>
						</>
					)}
					<div
						className="d-flex from-to-group wd-100p ml-auto mb-4 flex-md-nowrap flex-wrap wd-md-500"
						id="filter-time"
					>
						<div className="form-row flex-grow-1 mg-sm-r-5">
							<div className="col">
								<Flatpickr
									placeholder="From date"
									options={{
										dateFormat: 'd/m/Y',
										maxDate: new Date(),
									}}
									className="form-control"
									onChange={date => setFromDate(date)}
								/>
								{/* <input type="text" name="start-day " onChange={(value) =>  setFromDate(value)} className="form-control datetimepicker from-date" placeholder="From date" /> */}
							</div>
							<div className="col">
								<Flatpickr
									placeholder="To date"
									options={{
										dateFormat: 'd/m/Y',
										maxDate: new Date(),
										onOpen: function(selectedDates, dateStr, instance) {
											if (fromDate.length === 0) {
												instance.set('minDate', null);
												return;
											}
											instance.set('minDate', new Date(fromDate));
										},
									}}
									className="form-control"
									onChange={date => setToDate(date)}
								/>
							</div>
						</div>
						<div className="flex-grow-0 tx-right flex-shrink-0 mg-t-30 mg-sm-t-0">
							<button
								type="button"
								className="btn btn-primary "
								onClick={_onFilterDate}
							>
								<i className="fa fa-filter" /> Filter
							</button>
						</div>
					</div>
					<div className="feedback-container">
						{loadingListEvaluation ? (
							<SkeletonFeedback />
						) : (
							<div className="fb-list">
								{!!listFeedback && listFeedback.length > 0 ? (
									listFeedback.map(item => (
										<StudentCommentItem
											key={item.ElearnBookingID}
											ScheduleTimeVN={item.ScheduleTimeVN}
											TeacherName={item.TeacherName}
											TeacherIMG={item.TeacherIMG}
											TeacherUID={item.TeacherUID}
											Note={item.Note}
											Rate={item.Rate}
											LinkDetail={item.LinkDetail}
											DocumentName={item.DocumentName}
											ListeningPoint={item.ListeningPoint}
											ReadingPoint={item.ReadingPoint}
											SpeakingPoint={item.SpeakingPoint}
											WritingPoint={item.WritingPoint}
											MaterialLink={item.MaterialLink}
											Material={item.Material}
											StudentRate={item.StudentRate}
											StudentEvaluation={item.StudentEvaluation}
											ID={item.ID}
										/>
									))
								) : (
									<div className="card card-custom shadow">
										<div className="card-body tx-center">
											<span className="d-block tx-center tx-danger tx-medium">
												Bạn không có phản hồi{' '}
												{filterOption.value !== '0' && (
													<>
														{filterOption.value}
														<i className="fa fa-star"></i>
													</>
												)}{' '}
												nào
											</span>
											<img
												src="../assets/img/no-booking.svg"
												alt="image"
												className="wd-200 mg-b-15"
											/>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
					{pageSize < totalResult && (
						<Pagination
							innerClass="pagination justify-content-end mt-3"
							activePage={page}
							itemsCountPerPage={pageSize}
							totalItemsCount={totalResult}
							pageRangeDisplayed={3}
							itemClass="page-item"
							linkClass="page-link"
							onChange={handlePageChange.bind(this)}
						/>
					)}
				</div>
			</div>
		</>
	);
};

ReactDOM.render(
	<I18nextProvider i18n={i18next}>
		<FeedbackNew />
	</I18nextProvider>,
	document.getElementById('react-feedback'),
);
