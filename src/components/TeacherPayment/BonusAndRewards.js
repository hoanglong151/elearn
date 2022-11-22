import React, { useState, useEffect } from 'react';
import { getSalaryTeacher } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import Pagination from 'react-js-pagination';
import NumberFormat from 'react-number-format';
import { Accordion, Card, Button } from 'react-bootstrap';
import { randomId } from '~src/utils';
const fakeData = [
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
	{
		id: randomId(),
		scheduleTime: '20/10/2020 10:30',
		lessonName: 'React JS with E-learning Project',
		studentName: 'Trương Thức',
		finishType: 'As Schedule',
		amount: 300,
	},
];

const RenderRow = ({ data, ...others }) => {
	debugger;
	const { StudentReferral, TeacherReferral, Rewards, ReasonforOtherBonus, Deductions, ReasonforDeduction } = data;
	return (
		<tr>
			<td data-title="No." className="tx-center">
				{others.number + 1 || 0}
			</td>
			<td data-title="Student Referral" className="tx-nowrap">
			<NumberFormat
					value={`${StudentReferral}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>

			<td data-title="Teacher
			Referral" className="tx-center">
			<NumberFormat
					value={`${TeacherReferral}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Rewards" className="tx-center">
			<NumberFormat
					value={`${Rewards}`}
					displayType={'text'}
					thousandSeparator={true}
					suffix={'$'}
				/>
				</td>
			<td data-title="Reason for OtherBonus" className="tx-center">
				{ReasonforOtherBonus}
			</td>
			
			<td data-title="Deductions" className="tx-center">
				<NumberFormat
					value={`${Deductions}`}
					displayType={'text'}   
					thousandSeparator={true}
					suffix={'$'}
				/>
			</td>
			<td data-title="Reason for Deduction" className="tx-center">
				{ReasonforDeduction}
			</td>
		</tr>
	);
};

const BonusAndRewards = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [pageNumber, setPageNumber] = useState(1);
	const [data, setData] = useState(null);
	const [pageSize, setPageSize] = useState(0);
	const [totalResult, setTotalResult] = useState(0);
	const loadClassesAPI = async () => {
		setIsLoading(true);
		try
		{
			const params = {
				Page: parseInt(pageNumber), //Int
				FromDate: '',
				ToDate: '',
			};
			const res = await getSalaryTeacher(params);
			res.Code === 1 ? setData(res.Data) : setData([]);
			setPageSize(res.PageSize);
			setTotalResult(res?.TotalResult ?? 0);
			//res.Code === 1 ? setData(res.Data) : setData([]);
			//setPageSize(10);
			//setTotalResult(fakeData.length);
			//setData(fakeData);
		} catch (error) {
			console.log(JSON.stringify(error));
		}
		setIsLoading(false);
		//console.log('fakeDataLenght', fakeData.length);
	};

	useEffect(() => {
		loadClassesAPI();
	}, [pageNumber]);

	useEffect(() => {
		console.log(fakeData);
	}, [pageSize, totalResult]);

	return (
		<>
			<div className="mg-b-30">
				<Accordion>
					<Card>
						<Accordion.Toggle as={Card.Header} eventKey="0">
							<div className="d-flex align-items-center justify-content-between">
								<div className="d-flex align-items-center  flex-grow-1">
									<h5 className="tx-dark mg-lg-b-0 mg-b-0">Bonus & Rewards</h5>
									<div className="v-divider"></div>
									<p className="mg-b-0 tx-20 tx-bold tx-primary"></p>
								</div>

								<span className="tx-black btn-collapse">
									<i className="fas fa-caret-down"></i>
								</span>
							</div>
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<Card.Body>
									<div className="mg-t-30">
									<table className="table responsive-table-vertical table-schedule-log table-hover ">
										<thead className="thead-primary">
											<tr className="gv-bg-table">
												<th className="tx-center">No.</th>
												<th className="tx-left">Student Referral</th>
												<th className="tx-center">Teacher Referral</th>
												<th className="tx-center">Other Bonus</th>
												<th className="tx-center">Reason for Other Bonus</th>
												<th className="tx-center">Deductions</th>
												<th className="tx-center">Reason for Deduction</th>
											</tr>
										</thead>
										<tbody>
											{isLoading ? (
												<>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
													<tr>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
														<td>
															<Skeleton />
														</td>
													</tr>
												</>
											) : !!data && !!data.length > 0 ? (
												data.map((item, index) => (
													<RenderRow
														key={`${index}`}
														data={{
															StudentReferral: item.BookingID,
															TeacherReferral: item.Schedule,
															Rewards: item.LessionName,
															ReasonforOtherBonus: item.StudentName,
															Deductions: item.StatusString,
															ReasonforDeduction: item.PriceIncentive,
														}}
														number={index}
													/>
												))
											) : (
												<tr>
													<td colSpan={4}>
														<span className="tx-danger d-block tx-center tx-medium tx-16">
															No classes record.
														</span>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
								<div className="d-flex flex-wrap justify-content-between mg-t-30">
									<div className="tx-gray-500 mg-y-10">
										Total records: {totalResult}
									</div>
									{totalResult > pageSize && (
										<Pagination
											innerClass="pagination"
											activePage={pageNumber}
											itemsCountPerPage={pageSize}
											totalItemsCount={totalResult}
											pageRangeDisplayed={5}
											onChange={page => setPageNumber(page)}
											itemClass="page-item"
											linkClass="page-link"
											activeClass="active"
										/>
									)}
								</div>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		</>
	);
};

export default BonusAndRewards;
