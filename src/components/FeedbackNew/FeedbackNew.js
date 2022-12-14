import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import StudentCommentItem from '~components/common/StudentComment/StudentCommentItem';
import SkeletonFeedback from '~components/common/Skeleton/SkeletonFeedback';
import Pagination from 'react-js-pagination';
import Flatpickr from 'react-flatpickr';

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

const FeedbackOption = props => {
	const { data, children } = props;
	const numberStar = parseInt(data.value);
	return (
		<components.Option {...props}>
			<div className="d-flex justify-content-between align-items-center">
				{numberStar > 0 ? (
					<>
						<span>
							{[...Array(numberStar)].map((item, index) => {
								return (
									<i key={`${index}`} className="fas fa-star tx-warning"></i>
								);
							})}
						</span>
						<span>({data.count})</span>
					</>
				) : (
					<>
						<span>All feedbacks</span>
						<span>({data.count})</span>
					</>
				)}
			</div>
		</components.Option>
	);
};

const FeedbackNew = () => {
	const [overview, setOverview] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingListEvaluation, setLoadingListEvaluation] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const [fromDate, setFromDate] = useState([]);
	const [toDate, setToDate] = useState([]);
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
				});
			} else if (fromDate.length > 0 && toDate.length == 0) {
				let DATA_SUBMIT = {
					fromDate: DateTimeFormat.format(new Date(fromDate)),
				};
				res = await getListEvaluation({
					FromDate: DATA_SUBMIT.fromDate,
					ToDate: DateTimeFormat.format(new Date()),
				});
			} else if (fromDate.length == 0 && toDate.length > 0) {
				let DATA_SUBMIT = {
					toDate: DateTimeFormat.format(new Date(toDate)),
				};
				res = await getListEvaluation({
					FromDate: DateTimeFormat.format(new Date()),
					ToDate: DATA_SUBMIT.toDate,
				});
			} else {
				res = await getListEvaluation();
			}
			setListFeedback(res.Data);
		} catch (err) {
			console.log('Err: ', err);
		}
		// loadAllClassesData();
	};
	const [filterOption, setFilterOption] = useState({
		label: 'T???t c??? ????nh gi??',
		value: '0',
		count: overview.AllEvaluation,
	});
	const [feedback, setFeedback] = useState([]);
	const [rate, setRate] = useState(0);

	const [listFeedback, setListFeedback] = useState([]);
	const [detailStatisticSkill, setDetailStatisticSkill] = useState();
	const [detailStatisticSchedule, setDetailStatisticSchedule] = useState();

	const getAllFeedback = async () => {
		try {
			const res = await getListEvaluation();
			if (res.Code == 1) {
				setListFeedback(res.Data);
			}
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
		getAllFeedback();
		getDetailStatisticSkill();
		getDetailStatisticSchedule();
	}, []);

	const handlePageChange = pageNumber => {
		if (page !== pageNumber) {
			setPage(pageNumber);
			_GetListEvaluationAPI({
				Rate: rate,
				Page: pageNumber,
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

	const _GetListEvaluationAPI = async params => {
		setLoadingListEvaluation(true);
		const res = await getListEvaluationAPI(params);
		if (res.Code === 1) {
			setFeedback(res.Data);
			setPageSize(res.PageSize);
			setTotalResult(res.TotalResult);
		}
		setPage(params.Page);
		setLoadingListEvaluation(false);
	};

	const fetchListEvaluation = e => {
		let rateFilter = parseInt(e.target.value);
		if (rateFilter === rate) return;
		setRate(rateFilter);
		_GetListEvaluationAPI({
			Rate: rateFilter,
			Page: 1,
		});
	};

	useEffect(() => {
		_GetListEvaluationAPI({
			Rate: parseInt(filterOption?.value) ?? 0,
			Page: 1,
		});
	}, [filterOption]);

	useEffect(() => {
		getOverViewAPI();
	}, []);

	return (
		<>
			{!loading && (
				<>
					<div className="d-sm-flex align-items-center justify-content-between mg-b-30">
						<h4 className="mg-b-0 gradient-heading">
							<i className="fas fa-comment-dots"></i>Teacher???s Feedbacks
						</h4>
						{overview && Object.keys(overview).length > 0 && (
							<div className="form-group d-inline-block wd-200 mg-b-0-f mg-t-15 mg-sm-t-0-f">
								<Select
									components={{ Option: FeedbackOption }}
									value={filterOption}
									onChange={value => setFilterOption(value)}
									styles={appSettings.selectStyle}
									options={[
										{
											label: 'T???t c??? ????nh gi??',
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
								/>
								{/* <select
									className="form-control main-color bg-white"
									style={{ fontFamily: 'FontAwesome' }}
									onChange={fetchListEvaluation}
								>
									<option value="0">T???t c??? ({overview.AllEvaluation})</option>
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
								Everage Learning Performance Chart
							</h4>
							<ChartEverageSkill detailStatisticSkill={detailStatisticSkill} />
						</div>
						<div className="chart">
							<h4 style={{ marginBottom: 16 }}>Lesson Booking Progress</h4>
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
										B???n kh??ng c?? ph???n h???i{' '}
										{filterOption.value !== '0' && (
											<>
												{filterOption.value}
												<i className="fa fa-star"></i>
											</>
										)}{' '}
										n??o
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
		</>
	);
};

ReactDOM.render(<FeedbackNew />, document.getElementById('react-feedback'));
