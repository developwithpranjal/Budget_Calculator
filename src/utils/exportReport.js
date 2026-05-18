function escapeCsvCell(val) {
  const s = String(val ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatCsvDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toISOString();
  } catch {
    return "";
  }
}

export function downloadTransactionsCsv(transactions, filenameBase = "expenso-transactions") {
  const headers = [
    "id",
    "type",
    "amount_inr",
    "title",
    "category",
    "currency",
    "created_at_iso",
    "user_id",
  ];
  const rows = transactions.map((t) =>
    [
      t.id,
      t.type,
      t.TransactionAmount,
      t.Title ?? "",
      t.category ?? "",
      t.currencyType ?? "",
      formatCsvDate(t.createdAt),
      t.userId ?? "",
    ]
      .map(escapeCsvCell)
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function topExpenseCategories(transactions, limit = 6) {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const k = t.category || "Other";
      map[k] = (map[k] || 0) + Number(t.TransactionAmount || 0);
    });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export async function downloadSummaryPdf({
  totalIncome,
  totalExpense,
  totalBalance,
  transactions,
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  let y = margin;

  const title = "Expenso — budget summary";
  const dateStr = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated: ${dateStr}`, margin, y);
  y += 12;
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Totals (INR)", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Total income:    Rs ${Number(totalIncome).toFixed(2)}`, margin, y);
  y += 6;
  doc.text(`Total expenses: Rs ${Number(totalExpense).toFixed(2)}`, margin, y);
  y += 6;
  doc.text(`Net balance:    Rs ${Number(totalBalance).toFixed(2)}`, margin, y);
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Top expense categories", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const top = topExpenseCategories(transactions, 8);
  if (top.length === 0) {
    doc.text("No expense rows recorded.", margin, y);
    y += 6;
  } else {
    top.forEach(([name, amt]) => {
      const line = `${name}: Rs ${amt.toFixed(2)}`;
      const lines = doc.splitTextToSize(line, 180);
      lines.forEach((ln) => {
        if (y > 280) {
          doc.addPage();
          y = margin;
        }
        doc.text(ln, margin, y);
        y += 5;
      });
    });
  }

  y += 8;
  if (y > 265) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "This report reflects data present in your session at export time.",
    margin,
    y,
  );

  const safeDate = new Date().toISOString().slice(0, 10);
  doc.save(`expenso-summary-${safeDate}.pdf`);
}
