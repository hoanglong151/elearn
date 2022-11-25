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
			<div style={{ marginTop: 30, display: 'flex' }}>
				<div style={{ width: '60%', paddingRight: 16 }}>{props.children}</div>
				<div style={{ width: '40%' }}>
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
	const totalPercentBooked = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status0 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalPercentAsSchedule = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status1 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalPercentStudentAbsent = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status2 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalPercentTeacherLate = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				(detailStatisticSchedule.Status5 /
					detailStatisticSchedule.TotalLesson) *
				100
			);
		}
	}, [detailStatisticSchedule]);
	const totalPercent = useMemo(() => {
		if (!!detailStatisticSchedule) {
			return (
				totalPercentBooked +
				totalPercentAsSchedule +
				totalPercentStudentAbsent +
				totalPercentTeacherLate
			);
		}
	}, [
		totalPercentBooked,
		totalPercentAsSchedule,
		totalPercentStudentAbsent,
		totalPercentTeacherLate,
	]);
	const createLabel = () => {
		return (
			<div className="wrapper-chart-schedule">
				<div className="schedule-item">
					<span
						className="color-status"
						style={{ backgroundColor: '#e96b02' }}
					></span>
					<span>{t('as-schedule')}</span>
				</div>
				<div className="schedule-item">
					<span
						className="color-status"
						style={{ backgroundColor: '#3e98c7' }}
					></span>
					<span>{t('booked')}</span>
				</div>
				<div className="schedule-item">
					<span
						className="color-status"
						style={{ backgroundColor: '#f00' }}
					></span>
					<span>{t('student-no-show')}</span>
				</div>
				<div className="schedule-item">
					<span
						className="color-status"
						style={{ backgroundColor: '#1d9e0e' }}
					></span>
					<span>{t('teacher-late')}</span>
				</div>
			</div>
		);
	};

	return (
		<div>
			<Example label={createLabel()}>
				<CircularProgressbarWithChildren
					value={totalPercent}
					text={!!totalPercent ? `${totalPercent.toFixed(2)}%` : null}
					styles={buildStyles({
						textColor: '#fd7e14',
						pathColor: '#fd7e14',
						trailColor: '#eee',
						strokeLinecap: 'butt',
					})}
				>
					{/* Foreground path */}
					<CircularProgressbarWithChildren
						value={
							totalPercentBooked +
							totalPercentStudentAbsent +
							totalPercentTeacherLate
						}
						styles={buildStyles({
							trailColor: 'transparent',
							strokeLinecap: 'butt',
						})}
					>
						<CircularProgressbarWithChildren
							value={totalPercentStudentAbsent + totalPercentTeacherLate}
							styles={buildStyles({
								trailColor: 'transparent',
								strokeLinecap: 'butt',
								pathColor: '#f00',
							})}
						>
							<CircularProgressbarWithChildren
								value={totalPercentTeacherLate}
								styles={buildStyles({
									trailColor: 'transparent',
									strokeLinecap: 'butt',
									pathColor: '#1d9e0e',
								})}
							/>
						</CircularProgressbarWithChildren>
					</CircularProgressbarWithChildren>
				</CircularProgressbarWithChildren>
			</Example>
		</div>
	);
};

export default memo(ChartSchedule);
