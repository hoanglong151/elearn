import React from 'react';
import ReactDOM from 'react-dom';

const LessonItem = ({
	BookingID,
	CoursesName,
	DocumentID,
	DocumentDetailID,
	DocumentName,
	LessionName,
	LessonDetail,
	start,
	end,
	date,
	TeacherUID,
	TeacherName,
	Status,
	StatusString,
}) => {
	return (
		<tr>
			<td style={{ letterSpacing: '0.5px' }}>{date}</td>
			<td>{CoursesName}</td>
			<td>{DocumentName}</td>
			<td style={{ whiteSpace: 'pre-line' }}>{LessionName}</td>
			<td className="tx-nowrap">
				<a href={`/ElearnStudent/teacherDetail?ID=${TeacherUID}`}>
					{TeacherName}
				</a>
			</td>
			<td className="tx-nowrap">
				<span className="tx-success">{StatusString}</span>
			</td>
			<td>
				{LessonDetail && LessonDetail.split('ID=')[1] !== '0' && (
					<a href={LessonDetail} className="btn btn-info btn-icon">
						<i className="fas fa-file-alt mg-r-10"></i>
						Chi tiết
					</a>
				)}
			</td>
		</tr>
	);
};

export default LessonItem;
