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
import React, { useMemo, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { BarChart2 } from 'styled-icons/evaicons-solid';

const ChartEverageSkill = props => {
	const { detailStatisticSkill } = props;
	const { t, i18n } = useTranslation('common');
	const [height, setHeight] = useState();
	const dataChart = useMemo(() => {
		let data = [];
		// !!detailStatisticSkill &&
		// 	detailStatisticSkill.map((chart, index) => {
		// 		console.log('Chart: ', chart.indexOf('Point'));
		// 	});
		if (!!detailStatisticSkill) {
			Object.keys(detailStatisticSkill).forEach((key, index, arr) => {
				data.push({
					name: key.slice(0, key.indexOf('Point')),
					pv: detailStatisticSkill[key],
				});
			});
		}
		return data;
	}, [detailStatisticSkill]);
	useEffect(() => {
		const getElement = document.querySelector('.chart-higher');
		setHeight(getElement.clientHeight);
		window.addEventListener('resize', () => {
			const getElement = document.querySelector('.chart-higher');
			setHeight(getElement.clientHeight);
		});
	}, []);
	return (
		<ResponsiveContainer width="100%" height={height}>
			<BarChart layout="vertical" width={450} height={height} data={dataChart}>
				<XAxis domain={[0, 10]} tickCount={11} type="number" padding={80} />
				<YAxis type="category" dataKey="name" height={50} />
				<CartesianGrid strokeDasharray="3 3" />
				<Tooltip />
				<Bar dataKey="pv" fill="#fd7e14" barSize={20} name={t('point')} />
			</BarChart>
		</ResponsiveContainer>
	);
};

export default memo(ChartEverageSkill);
