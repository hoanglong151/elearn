import {
	BarChart,
	Bar,
	ResponsiveContainer,
	Legend,
	Tooltip,
	CartesianGrid,
	YAxis,
	XAxis,
} from 'recharts';
import React, { useMemo, memo } from 'react';

const ChartEverageSkill = props => {
	const { detailStatisticSkill } = props;
	console.log('detailStatisticSkill: ', detailStatisticSkill);
	let data = [];
	useMemo(() => {
		// !!detailStatisticSkill &&
		// 	detailStatisticSkill.map((chart, index) => {
		// 		console.log('Chart: ', chart.indexOf('Point'));
		// 	});

		!!detailStatisticSkill &&
			Object.keys(detailStatisticSkill).forEach((key, index, arr) => {
				console.log(
					'Keey: ',
					key.slice(0, key.indexOf('Point')),
					detailStatisticSkill[key],
				);
				data.push({
					name: key.slice(0, key.indexOf('Point')),
					pv: detailStatisticSkill[key],
				});
			});
	}, [detailStatisticSkill]);

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart layout="vertical" width={400} height={350} data={data}>
				<XAxis domain={[1, 10]} tickCount={10} type="number" padding={80} />
				<YAxis
					domain={[1, 10]}
					tickCount={10}
					type="category"
					dataKey="name"
					height={50}
					width={75}
				/>
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Bar dataKey="pv" fill="#fd7e14" barSize={20} name="Điểm" />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default memo(ChartEverageSkill);
