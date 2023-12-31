import React from 'react';
import axios from 'axios';
import { GET_PRINTERJOBS_URL } from '../../constants/url';
import Grid from '../Grid/Grid';
import extractAPIResponse from '../../utils/extractAPIResponse';

/**
 *
 */
export default function PrinterJobGrid() {
  const [printerJobs, setPrinterJobs] = React.useState([]);
  const loadPrinterJobs = () => axios.get(GET_PRINTERJOBS_URL)
    .then(({ data }) => extractAPIResponse(data))
    .then((rows) => rows.map((row) => ({ ...row, createdAt: new Date(row.createdAt) })));
  const deletePrinterJobs = (ids) => { throw new Error('Not supported'); };
  const updatePrinterJobs = (rows) => { throw new Error('Not supported'); };
  const createNewPrinterJob = () => { throw new Error('Not supported'); };
  const showActions = {
    showView: true,
  };
  const showToolBar = {
    showSearch: true,
  };
  const columns = [
    {
      field: 'id',
      headerName: 'Id',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'userId',
      headerName: 'User Id',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'campus',
      headerName: 'Campus',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'building',
      headerName: 'Building',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'room',
      headerName: 'Room',
      type: 'number',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      align: 'right',
      headerAlign: 'right',
      hideable: true,
      flex: 1,
    },
    {
      field: 'copiesNo',
      headerName: 'Copies',
      type: 'text',
      hideable: true,
      flex: 1,
    },
    {
      field: 'startPage',
      headerName: 'Start Page',
      hideable: true,
      flex: 1,
    },
    {
      field: 'endPage',
      headerName: 'End Page',
      hideable: true,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      type: 'dateTime',
      hideable: true,
      flex: 1,
    },
  ];

  return (
    <Grid
      columns={columns}
      createNewRow={createNewPrinterJob}
      deleteRows={deletePrinterJobs}
      loadRows={loadPrinterJobs}
      rows={printerJobs}
      setRows={setPrinterJobs}
      showActions={showActions}
      showToolBar={showToolBar}
      updateRows={updatePrinterJobs}
    />
  );
}
