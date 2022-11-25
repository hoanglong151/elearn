import React from 'react';
import ReactDOM from 'react-dom';
import styles from './teacherClassRoomsNew.module.scss';
import { getAllClass, getUpcomingClass } from '~src/api/teacherAPI';
import Skeleton from 'react-loading-skeleton';
import UpComingTable from '~components/table/UpComingTable';
import AllClassesTable from '~components/table/AllClassesTable';
import MissingFeedbackTable from '~components/table/MissingFeedbackTable';
import StudentInformationModal from '~components/StudentInformationModal';
import { Tab } from 'react-bootstrap';
import HeaderNoDom from '../HeaderNoDom';
import ProfileSidebarNoDom from '../ProfileSidebarNoDom';
import BottomMenu from '../BottomMenu';

const TeacherClassRoomsNew = () => {
	const [studentId, setStudentId] = React.useState(null);
	const mdStudentInfo = React.useRef(true);
	const [activeTab, setActiveTab] = React.useState('upcoming');
	const showStudentModal = studentId => {
		setStudentId(studentId);
		$(mdStudentInfo.current).modal('show');
	};

	const unMountComponents = () => {
		mdStudentInfo.current = false;
	};

	React.useEffect(() => {
		return unMountComponents;
	}, []);

	return (
		<>
			<div className="Header">
				<HeaderNoDom />
				<BottomMenu />
			</div>
			<div className="wrapper-new">
				<div
					className="ProfileSidebar profile-sidebar-no-dom profilesidebar-show-only-mobile"
					id="js-component-profilesidebar-1"
				>
					<ProfileSidebarNoDom />
				</div>
				<div style={{ width: '100%' }}>
					<div className="teacher__detail__wrap ">
						<div className="teacher__detail ">
							<div className="teacher-body mg-t-0-f card card-custom">
								<div className="tab-navigation teacher-custom card-body pd-y-15-f">
									<ul className="list-tab" id="js-list-tab">
										<li
											className={`tab-item`}
											onClick={() => setActiveTab('upcoming')}
										>
											<a
												className={`tab-link ${
													activeTab === 'upcoming' ? 'active' : ''
												}`}
											>
												<i className="far fa-calendar-alt"></i> Upcoming classes
											</a>
										</li>
										<li
											className={`tab-item`}
											onClick={() => setActiveTab('missing')}
										>
											<a
												className={`tab-link ${
													activeTab === 'missing' ? 'active' : ''
												}`}
											>
												<i className="far fa-comment-alt"></i> Missing feedback
											</a>
										</li>
										<li
											className={`tab-item`}
											onClick={() => setActiveTab('allclass')}
										>
											<a
												className={`tab-link ${
													activeTab === 'allclass' ? 'active' : ''
												}`}
											>
												<i className="far fa-calendar-check"></i> All Classes
											</a>
										</li>
									</ul>
								</div>
								<div className="teacher__info-wrap pd-t-0-f card-body">
									<Tab.Container
										activeKey={activeTab}
										defaultActiveKey={activeTab}
									>
										<Tab.Content>
											<Tab.Pane eventKey="upcoming">
												<UpComingTable showStudentModal={showStudentModal} />
											</Tab.Pane>
											<Tab.Pane eventKey="missing">
												<MissingFeedbackTable />
											</Tab.Pane>
											<Tab.Pane eventKey="allclass">
												<AllClassesTable showStudentModal={showStudentModal} />
											</Tab.Pane>
										</Tab.Content>
									</Tab.Container>
								</div>
							</div>
						</div>
					</div>
					<StudentInformationModal ref={mdStudentInfo} studentId={studentId} />
				</div>
			</div>
		</>
	);
};

const domContainer = document.getElementById('react-teacher-classrooms');
ReactDOM.render(<TeacherClassRoomsNew />, domContainer);
