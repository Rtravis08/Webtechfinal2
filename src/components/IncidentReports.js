import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/IncidentReports.css';
import { IconButton, Menu, MenuItem, TextField, Select, FormControl, InputLabel, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditModal from './EditModal';
import { useNavigate } from 'react-router-dom';

const IncidentReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(3); // Set to display 3 reports per page

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8080/api/v1/incidents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let fetchedReports = response.data;

        if (role !== 'ADMIN') {
          fetchedReports = fetchedReports.filter(report => report.user.userId == userId);
        }
        
        setReports(fetchedReports);
        setFilteredReports(fetchedReports);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Unauthorized. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          navigate('/login');
        } else {
          toast.error('Failed to fetch incident reports. Please try again.');
        }
      }
    };

    fetchReports();
  }, [role, userId, navigate]);

  useEffect(() => {
    // Filter and sort reports based on the search term and sorting criteria
    let filtered = reports.filter(report =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.sort((a, b) => {
      if (sortCriteria === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.reportedAt) - new Date(b.reportedAt)
          : new Date(b.reportedAt) - new Date(a.reportedAt);
      } else if (sortCriteria === 'severity') {
        return sortOrder === 'asc'
          ? a.severity.localeCompare(b.severity)
          : b.severity.localeCompare(a.severity);
      } else {
        return 0;
      }
    });

    setFilteredReports(filtered);
  }, [searchTerm, reports, sortCriteria, sortOrder]);

  const handleMenuClick = (event, report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleEdit = () => {
    setOpenModal(true);
    handleMenuClose();
  };

  const handleApprove = () => {
    toast.info(`Approve report with ID: ${selectedReport.incidentId}`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/v1/incidents/${selectedReport.incidentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports(reports.filter(report => report.incidentId !== selectedReport.incidentId));
      setFilteredReports(filteredReports.filter(report => report.incidentId !== selectedReport.incidentId)); // Update filteredReports as well
      toast.success('Incident deleted successfully!');
      handleMenuClose();
    } catch (error) {
      toast.error('Failed to delete incident. Please try again.');
      console.error(error);
    }
  };

  const handleUpdate = async (updatedReport) => {
    const errors = {};
    if (Object.keys(errors).length > 0) {
      for (const key in errors) {
        toast.error(errors[key]);
      }
      return;
    }
    const { title, description, latitude, longitude, status, severity, imageUrl } = updatedReport;
    const requestBody = { title, description, latitude, longitude, status, severity, imageUrl };
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.put(`http://localhost:8080/api/v1/incidents/${updatedReport.incidentId}?userId=${userId}`, requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.incidentId === updatedReport.incidentId ? response.data : report
        )
      );
      setFilteredReports((prevReports) =>
        prevReports.map((report) =>
          report.incidentId === updatedReport.incidentId ? response.data : report
        )
      );
      toast.success('Incident updated successfully!');
    } catch (error) {
      toast.error('Failed to update incident. Please try again.');
      console.error(error);
    }
  };

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="incident-reports">
      <h2>Incident Reports</h2>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="sorting-controls">
        <FormControl variant="outlined" className="sorting-control">
          <InputLabel htmlFor="sort-criteria">Sort By</InputLabel>
          <Select
            native
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            label="Sort By"
            inputProps={{
              name: 'sort-criteria',
              id: 'sort-criteria',
            }}
          >
            <option value="date">Date</option>
            <option value="severity">Severity</option>
          </Select>
        </FormControl>
        <FormControl variant="outlined" className="sorting-control">
          <InputLabel htmlFor="sort-order">Order</InputLabel>
          <Select
            native
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            label="Order"
            inputProps={{
              name: 'sort-order',
              id: 'sort-order',
            }}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentReports.map(report => (
              <TableRow key={report.incidentId}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{new Date(report.reportedAt).toLocaleDateString()}</TableCell>
                <TableCell>{report.latitude}, {report.longitude}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.severity}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, report)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleApprove}>Approve</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination-wrapper">
        <Pagination
          count={Math.ceil(filteredReports.length / reportsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          className="pagination"
        />
      </div>
      {selectedReport && (
        <EditModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          report={selectedReport}
          handleUpdate={handleUpdate}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default IncidentReports;
