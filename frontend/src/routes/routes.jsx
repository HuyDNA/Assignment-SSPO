import HomePage from '../pages/home/HomePage';
import PrintersPage from '../pages/printers/PrintersPage';
import FilesPage from '../pages/files/FilesPage';
import PrintPage from '../pages/print/PrintPage';
import PrinterDetailPage from '../pages/printerDetail/PrinterDetailPage';
import FileDetailPage from '../pages/fileDetail/FileDetailPage';
import HistoryPage from '../pages/history/HistoryPage';
import UsersPage from '../pages/users/UserPage';
import ReportsPage from '../pages/reports/ReportsPage';
import ReportDetailPage from '../pages/reportDetail/ReportDetailPage';
import FeedbacksPage from '../pages/feedbacks/FeedbacksPage';
import PackagesPage from '../pages/packages/PackagesPage';
import PaymentPage from '../pages/payment/PaymentPage';

export const guestRoutes = [
  { path: '/', component: HomePage },
  { path: '/printers', component: PrintersPage },
  { path: '/printers/:id', component: PrinterDetailPage },
  { path: '/feedbacks', component: FeedbacksPage },
];

export const managerRoutes = [
  { path: '/', component: HomePage },
  { path: '/printers', component: PrintersPage },
  { path: '/printers/:id', component: PrinterDetailPage },
  { path: '/history', component: HistoryPage },
  { path: '/accounts', component: UsersPage },
  { path: '/reports', component: ReportsPage },
  { path: '/reports/:id', component: ReportDetailPage },
  { path: '/feedbacks', component: FeedbacksPage },
];

export const userRoutes = [
  { path: '/', component: HomePage },
  { path: '/printers', component: PrintersPage },
  { path: '/printers/:id', component: PrinterDetailPage },
  { path: '/files', component: FilesPage },
  { path: '/print', component: PrintPage },
  { path: '/files/:id', component: FileDetailPage },
  { path: '/history', component: HistoryPage },
  { path: '/feedbacks', component: FeedbacksPage },
  { path: '/payment', component: PaymentPage },
  { path: '/packages', component: PackagesPage },
];
