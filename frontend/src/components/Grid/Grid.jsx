import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import ViewIcon from '@mui/icons-material/Visibility';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import { NotificationStatus } from '../../constants/notification';
import useNotification from '../../hooks/useNotification';

/**
 *
 * @param root0
 * @param root0.setRows
 * @param root0.setRowModesModel
 * @param root0.checkedIds
 * @param root0.createNewRow
 * @param root0.deleteRows
 * @param root0.columns
 * @param root0.showToolBar
 */
function EditToolbar({
  setRows, setRowModesModel, checkedIds, createNewRow, deleteRows, columns, showToolBar,
}) {
  const notify = useNotification();
  const handleAddRows = async () => {
    try {
      notify(NotificationStatus.WAITING);
      const newRow = await createNewRow();
      setRows((oldRows) => [newRow, ...oldRows]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: columns[0].field },
      }));
      notify(NotificationStatus.OK, '');
    } catch (e) {
      notify(NotificationStatus.ERR, e.message);
    }
  };

  const handleDeleteRows = async () => {
    try {
      notify(NotificationStatus.WAITING);
      await deleteRows(checkedIds);
      setRows((oldRows) => oldRows.filter((row) => !checkedIds.includes(row.id)));
      setRowModesModel({});
      notify(NotificationStatus.OK, '');
    } catch (e) {
      notify(NotificationStatus.ERR, e.message);
    }
  };

  return (
    <div className="overflow-auto">
      <GridToolbarContainer>
        <Toolbar>
          <div className="flex flex-row gap-2">
            {
              (showToolBar === true || showToolBar.showAdd)
                && (
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRows}>
                  Thêm
                </Button>
                )
            }
            {
              (showToolBar === true || showToolBar.showDel)
              && (
              <Button color="primary" startIcon={<RemoveCircleOutlineIcon />} onClick={handleDeleteRows}>
                Xoá
              </Button>
              )
            }
            {
              (showToolBar === true || showToolBar.showSearch)
              && <GridToolbarQuickFilter />
            }
          </div>
        </Toolbar>
      </GridToolbarContainer>
    </div>
  );
}

/**
 *
 * @param root0
 * @param root0.columns
 * @param root0.rows
 * @param root0.setRows
 * @param root0.loadRows
 * @param root0.deleteRows
 * @param root0.updateRows
 * @param root0.createNewRow
 * @param root0.showActions
 * @param root0.showToolBar
 */
export default function Grid({
  columns,
  rows,
  setRows,
  loadRows,
  deleteRows,
  updateRows,
  createNewRow,
  showActions,
  showToolBar,
}) {
  const notify = useNotification();
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [checkedIds, setCheckedIds] = React.useState([]);

  React.useEffect(() => {
    loadRows().then((newRows) => setRows((oldRows) => [...oldRows, ...newRows]))
      .then(() => setLoading(false))
      .then(() => NotificationStatus.OK)
      .catch((e) => notify(NotificationStatus.ERR, e.message));
  }, []);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
    deleteRows([id]).then(() => notify(
      NotificationStatus.OK,
      '',
    ))
      .catch((e) => notify(
        NotificationStatus.ERR,
        e.message,
      ));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const augmentedColumns = !showActions ? columns : [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      align: 'right',
      headerAlign: 'right',
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          ...(
            (showActions === true || showActions.showEdit) ? [
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                className="textPrimary"
                onClick={handleEditClick(id)}
                color="inherit"
              />,
            ] : []
          ),
          ...(
            (showActions === true || showActions.showDel) ? [
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
              />,
            ] : []
          ),
          ...(
            (showActions === true || showActions.showEdit) ? [
              <GridActionsCellItem
                icon={<ViewIcon />}
                label="View"
                color="inherit"
                component={Link}
                to={`./${id}`}
                target="_blank"
              />,
            ] : []
          ),
        ];
      },
    },
  ];

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (updatedRow, originalRow) => {
    updateRows([updatedRow])
      .then(() => notify(
        NotificationStatus.OK,
        '',
      ))
      .then(() => setRows((oldRows) => {
        const newRows = [...oldRows];
        const updatedRowId = newRows.findIndex((row) => row.id === updatedRow.id);
        if (updatedRowId >= 0) {
          newRows[updatedRowId] = updatedRow;
        }
        return newRows;
      }))
      .catch((e) => notify(
        NotificationStatus.ERR,
        e.message,
      ));
    return originalRow;
  };

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        loading={loading}
        rows={rows}
        columns={augmentedColumns}
        editMode="row"
        checkboxSelection
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={setCheckedIds}
        slots={{
          toolbar: !showToolBar ? undefined : EditToolbar,
        }}
        slotProps={{
          toolbar: !showToolBar ? undefined : {
            setRows,
            setRowModesModel,
            checkedIds,
            createNewRow,
            deleteRows,
            columns: augmentedColumns,
            showToolBar,
          },
        }}
      />
    </Box>
  );
}
