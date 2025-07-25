// Reports controller stub

const getReports = (req, res) => res.json({ success: true, data: [] });
const getReport = (req, res) => res.json({ success: true, data: {} });
const createReport = (req, res) => res.json({ success: true, data: {} });
const updateReport = (req, res) => res.json({ success: true, data: {} });
const deleteReport = (req, res) => res.json({ success: true });
const assignReport = (req, res) => res.json({ success: true });

module.exports = {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  assignReport,
};
