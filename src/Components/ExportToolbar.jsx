import { useState } from "react";
import { MdPictureAsPdf, MdNotes } from "react-icons/md";
import {
  downloadTransactionsCsv,
  downloadSummaryPdf,
} from "../utils/exportReport";
import "./ExportToolbar.css";

export default function ExportToolbar({
  transactions,
  totalIncome,
  totalExpense,
  totalBalance,
}) {
  const [pdfBusy, setPdfBusy] = useState(false);

  const handleCsv = () => {
    if (!transactions.length) return;
    downloadTransactionsCsv(transactions);
  };

  const handlePdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      await downloadSummaryPdf({
        totalIncome,
        totalExpense,
        totalBalance,
        transactions,
      });
    } catch (e) {
      console.error(e);
      alert("PDF export failed. Run npm install if jspdf is missing.");
    } finally {
      setPdfBusy(false);
    }
  };

  const disabled = !transactions.length;

  return (
    <div className="export-toolbar" role="group" aria-label="Export data">
      <span className="export-toolbar-label">Export</span>
      <button
        type="button"
        className="export-btn"
        onClick={handleCsv}
        disabled={disabled}
        title={disabled ? "Add a transaction first" : "Download CSV"}
      >
        <MdNotes size={18} aria-hidden />
        CSV
      </button>
      <button
        type="button"
        className="export-btn primary"
        onClick={handlePdf}
        disabled={disabled || pdfBusy}
        title={disabled ? "Add a transaction first" : "Download PDF summary"}
      >
        <MdPictureAsPdf size={18} aria-hidden />
        {pdfBusy ? "PDF…" : "PDF"}
      </button>
    </div>
  );
}
