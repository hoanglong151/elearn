import React, { memo } from 'react';
// import 'react-circular-progressbar/dist/styles.css';
import {
	CircularProgressbar,
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';

const ChartSchedule = () => {
	return (
		<div className="wrapper-chart-schedule">
			<CircularProgressbarWithChildren
				value={98.5}
				styles={buildStyles({
					pathColor: '#f00',
					trailColor: '#eee',
					strokeLinecap: 'butt',
				})}
			>
				{/* Foreground path */}
				<CircularProgressbar
					value={95.5}
					text={`95.5%`}
					styles={buildStyles({
						textColor: '#e96b02',
						textSize: 16,
						pathColor: '#e96b02',
						trailColor: 'transparent',
						strokeLinecap: 'butt',
					})}
				></CircularProgressbar>
			</CircularProgressbarWithChildren>
			<div>
				<div>
					<span
						className="color-status"
						style={{ backgroundColor: '#e96b02' }}
					></span>
					<span>Hoàn Thành</span>
				</div>
				<div>
					<span
						className="color-status"
						style={{ backgroundColor: '#f00' }}
					></span>
					<span>Báo Hủy Trễ/Vắng</span>
				</div>
				<div>
					<span
						className="color-status"
						style={{ backgroundColor: '#eee' }}
					></span>
					<span>Còn Lại</span>
				</div>
			</div>
		</div>
	);
};

export default memo(ChartSchedule);
