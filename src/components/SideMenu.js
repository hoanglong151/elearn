import React, { useState, useEffect } from 'react';

const SideMenu = () => {
	const [activePage, setActivePage] = useState('');
	useEffect(() => {
		let pathUrl = window.location.pathname;
		setActivePage(pathUrl.toUpperCase());
	}, []);

	return (
		<ul className="list-unstyled profile-info-list course mg-b-0">
			<li
				className={
					activePage.indexOf('/DashBoard'.toUpperCase()) !== -1 ? 'active' : ''
				}
			>
				<a href="/ElearnStudent/DashBoard">
					<i className="fas fa-home icon"></i> Trang Chủ
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/ProfileUser'.toUpperCase()) !== -1
						? 'active'
						: ''
				}
			>
				<a href="/ElearnStudent/ProfileUser">
					<i className="fas fa-user-graduate icon"></i> Thông Tin Cá Nhân
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/BookedLesson'.toUpperCase()) !== -1
						? 'active'
						: ''
				}
			>
				<a href="/ElearnStudent/BookedLesson">
					<i className="fas fa-calendar icon"></i> Lịch Học
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/LessonHistory'.toUpperCase()) !== -1
						? 'active'
						: ''
				}
			>
				<a href="/ElearnStudent/LessonHistory">
					<i className="fas fa-list icon"></i> Lộ Trình Đã Học
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/FeedBack'.toUpperCase()) !== -1 ? 'active' : ''
				}
			>
				<a href="/ElearnStudent/FeedBack">
					<i className="fas fa-comment icon"></i> Nhận Xét Của Giáo Viên
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/Announcements'.toUpperCase()) !== -1
						? 'active'
						: ''
				}
			>
				<a href="/ElearnStudent/Announcements">
					<i className="fas fa-bell icon"></i> Thông Báo
				</a>
			</li>
			<li
				className={
					activePage.indexOf('/FAQ'.toUpperCase()) !== -1 ? 'active' : ''
				}
			>
				<a href="/ElearnStudent/FAQ">
					<i className="fas fa-question-circle icon"></i> Câu Hỏi Thường Gặp
				</a>
			</li>
		</ul>
	);
};

export default SideMenu;
