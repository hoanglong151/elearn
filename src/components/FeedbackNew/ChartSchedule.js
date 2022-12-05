import React, { memo, useMemo } from 'react';
// import 'react-circular-progressbar/dist/styles.css';
import {
	CircularProgressbar,
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';
import { useTranslation } from 'react-i18next';

function Example(props) {
	return (
		<>
			<div style={{ display: 'flex' }}>
				<div style={{ paddingRight: 16 }}>{props.children}</div>
				<div>
					<h3 className="h5">{props.label}</h3>
					<p>{props.description}</p>
				</div>
			</div>
		</>
	);
}

const ChartSchedule = props => {
	const { detailStatisticSchedule } = props;
	const { t, i18n } = useTranslation('common');
	const totalBooked = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status0 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalAsSchedule = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				((detailStatisticSchedule.Status1 + detailStatisticSchedule.Status5) /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalStudentAbsent = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status2 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalTeacherLate = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status5 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const total = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return detailStatisticSchedule.TotalLesson;
		}
	}, [detailStatisticSchedule]);
	const createLabel = () => {
		return (
			<div className="wrapper-chart-schedule">
				<div className="schedule-item">
					<div>
						<span
							className="color-status"
							style={{ backgroundColor: '#e96b02' }}
						></span>
						<span style={{ marginRight: '8px' }}>{t('as-schedule')}:</span>
					</div>
					<span>
						{detailStatisticSchedule?.Status1 +
							detailStatisticSchedule?.Status5}
					</span>
				</div>
				<div className="schedule-item">
					<div>
						<span
							className="color-status"
							style={{ backgroundColor: '#3e98c7' }}
						></span>
						<span style={{ marginRight: '8px' }}>{t('booked')}:</span>
					</div>
					<span>{detailStatisticSchedule?.Status0}</span>
				</div>
				<div className="schedule-item">
					<div>
						<span
							className="color-status"
							style={{ backgroundColor: '#f00' }}
						></span>
						<span style={{ marginRight: '8px' }}>{t('student-no-show')}:</span>
					</div>
					<span>{detailStatisticSchedule?.Status2}</span>
				</div>
				{/* <div className="schedule-item">
					<div>
						<span
							className="color-status"
							style={{ backgroundColor: '#1d9e0e' }}
						></span>
						<span style={{ marginRight: '8px' }}>{t('teacher-late')}:</span>
					</div>
					<span>{detailStatisticSchedule?.Status5}</span>
				</div> */}
				<div className="schedule-item">
					<span style={{ marginRight: '8px' }}>{t('remaininglessons')}:</span>
					<span>
						{detailStatisticSchedule?.TotalLesson -
							(detailStatisticSchedule?.Status0 +
								detailStatisticSchedule?.Status1 +
								detailStatisticSchedule?.Status2 +
								detailStatisticSchedule?.Status5)}
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className="chart-higher">
			<Example label={createLabel()}>
				<CircularProgressbarWithChildren
					// totalAsSchedule + totalBooked + totalStudentAbsent
					value={totalAsSchedule + totalBooked + totalStudentAbsent}
					styles={buildStyles({
						textColor: '#fd7e14',
						pathColor: '#fd7e14',
						trailColor: '#eee',
						strokeLinecap: 'butt',
					})}
				>
					{/* Foreground path */}
					<CircularProgressbarWithChildren
						value={totalBooked + totalStudentAbsent + totalTeacherLate}
						styles={buildStyles({
							trailColor: 'transparent',
							strokeLinecap: 'butt',
						})}
					>
						<CircularProgressbarWithChildren
							value={totalStudentAbsent + totalTeacherLate}
							styles={buildStyles({
								trailColor: 'transparent',
								strokeLinecap: 'butt',
								pathColor: '#f00',
							})}
						>
							{/* <CircularProgressbarWithChildren
								value={totalTeacherLate}
								styles={buildStyles({
									trailColor: 'transparent',
									strokeLinecap: 'butt',
									pathColor: '#1d9e0e',
								})}
							> */}
							<div className="chart-schedule-title">
								{/* total */}
								<p>{total}</p>
								<p>Lessons</p>
							</div>
							{/* </CircularProgressbarWithChildren> */}
						</CircularProgressbarWithChildren>
					</CircularProgressbarWithChildren>
				</CircularProgressbarWithChildren>
			</Example>
		</div>
	);
};

export default memo(ChartSchedule);
