import { Router } from 'express';
import PrintersAPI from './printers/index.js';
import ReportsAPI from './reports/index.js';
import FilesAPI from './files/index.js';
import PrinterJobsAPI from './printerJobs/index.js';
import FeedbacksAPI from './feedbacks/index.js';
import UsersAPI from './users/index.js';
import TransactionsAPI from './transactions/index.js';
import ConfigsAPI from './configs/index.js';
import PackagesAPI from './packages/index.js';
import PaymentAPI from './payment/index.js';
import GrantAPI from './grant/index.js';

const router = Router();

router.use('/printers', PrintersAPI);
router.use('/reports', ReportsAPI);
router.use('/files', FilesAPI);
router.use('/printerjobs', PrinterJobsAPI);
router.use('/feedbacks', FeedbacksAPI);
router.use('/users', UsersAPI);
router.use('/transactions', TransactionsAPI);
router.use('/configs', ConfigsAPI);
router.use('/packages', PackagesAPI);
router.use('/payment', PaymentAPI);
router.use('/grant', GrantAPI);
export default router;
