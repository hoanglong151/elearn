import React from 'react';

const BottomMenu = () => {
	return (
		<div className="bottom-header">
			<div className="container">
				<a id="js-burger-menu" className="burger-menu-bottom">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						className="feather feather-menu"
					>
						<line x1="3" y1="12" x2="21" y2="12"></line>
						<line x1="3" y1="6" x2="21" y2="6"></line>
						<line x1="3" y1="18" x2="21" y2="18"></line>
					</svg>
				</a>
				<ul className="hd-menu-list" data-title="Mona Media">
					<li className="menu-link ">
						<a href="/ElearnTeacher/Dashboard" className="link-icon  dashboard">
							Home
						</a>
					</li>
					<li className="menu-link">
						<a href="/ElearnTeacher/Schedule" className="link-icon schedule">
							Booking
						</a>
					</li>
					<li className="menu-link">
						<a
							href="/ElearnTeacher/ClassRooms"
							className="link-icon classNamerooms"
						>
							Classrooms
						</a>
					</li>
					<li className="menu-link">
						<a
							href="/ElearnTeacher/LibraryList"
							className="link-icon librarylist"
						>
							Library
						</a>
					</li>
					<li className="menu-link">
						<a
							href="/ElearnTeacher/Statistics"
							className="link-icon statistics"
						>
							Monthly Statistics
						</a>
					</li>
					<li className="menu-link">
						<a href="/ElearnTeacher/Salary" className="link-icon salary">
							Payment
						</a>
					</li>
					<li className="menu-link">
						<a href="/ElearnTeacher/Feedback" className="link-icon feedback">
							Feedbacks
						</a>
					</li>
					<li className="menu-link">
						<a
							href="/ElearnTeacher/SupportList"
							className="link-icon supportlist"
						>
							Support
						</a>
					</li>
				</ul>
				<div className="menu-overlay"></div>
			</div>
		</div>
	);
};

export default BottomMenu;
