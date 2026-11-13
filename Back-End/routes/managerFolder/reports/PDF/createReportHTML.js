function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
}

function formatValue(value, key) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("en-GB");
  }

  if (key === "difference" && Number(value) > 0) {
    return `+${value}`;
  }

  return String(value);
}

// Determine cell color according to sales performance
function getCellClass(column, row) {
  if (column.key === "performance") {
    switch (row.performance) {
      case "Exceeded":
      case "Met":
        return "success";

      case "Below Target":
        return "danger";

      case "In Progress":
        return "warning";

      default:
        return "neutral";
    }
  }

  if (
    column.key === "difference" &&
    row.performance !== undefined &&
    row.difference !== null
  ) {
    if (row.performance === "In Progress") {
      return "warning";
    }

    if (row.difference > 0) return "success";
    if (row.difference < 0) return "danger";

    return "neutral";
  }

  return "";
}

function createReportHTML(title, columns, rows, from, to) {
  const generatedDate = new Date().toLocaleDateString("en-GB");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #382116;
            font-size: 11px;
          }

          /* Report Header */
          .reportHeader {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #4b1426;
          }

          .brand {
            margin: 0;
            font-family: Georgia, serif;
            font-size: 30px;
            font-weight: normal;
            letter-spacing: 5px;
            color: #4b1426;
          }

          .subtitle {
            margin-top: 8px;
            font-size: 9px;
            letter-spacing: 2px;
            color: #997783;
          }

          .reportTitle {
            margin: 22px 0 0;
            font-size: 18px;
            font-weight: 500;
            color: #4b1426;
          }

          /* Report Details */
          .reportDetails {
            display: flex;
            justify-content: space-between;
            margin: 22px 0;
            font-size: 11px;
            color: #765563;
          }

          .reportDetails p {
            margin: 5px 0;
          }

          /* Table */
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 10px;
          }

          th,
          td {
            padding: 9px 7px;
            border: 1px solid #e8d7d2;
            text-align: left;
            overflow-wrap: anywhere;
          }

          th {
            background-color: #4b1426;
            color: white;
            font-weight: 600;
          }

          tbody tr:nth-child(even) {
            background-color: #f6f0e9;
          }

          thead {
            display: table-header-group;
          }

          tr {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .emptyMessage {
            text-align: center;
            padding: 25px;
            color: #997783;
          }

          /* Sales Performance Colors */
          td.success {
            background-color: #e3f2e8;
            color: #26734d;
            font-weight: 600;
          }

          td.danger {
            background-color: #f8e2e2;
            color: #a12f39;
            font-weight: 600;
          }

          td.warning {
            background-color: #fff0d5;
            color: #986315;
            font-weight: 600;
          }

          td.neutral {
            background-color: #ededed;
            color: #666666;
            font-weight: 600;
          }
        </style>
      </head>

      <body>
        <div class="reportHeader">
          <h1 class="brand">ELONA</h1>

          <div class="subtitle">
            EXCLUSIVE FASHION FOR STRONG WOMEN
          </div>

          <h2 class="reportTitle">
            ${escapeHTML(title)}
          </h2>
        </div>

        <div class="reportDetails">
          <div>
            <p>
              <strong>Generated:</strong>
              ${escapeHTML(generatedDate)}
            </p>

            <p>
              <strong>Total Records:</strong>
              ${rows.length}
            </p>
          </div>

          ${
            from && to
              ? `
                <div>
                  <p>
                    <strong>From:</strong>
                    ${escapeHTML(from)}
                  </p>

                  <p>
                    <strong>To:</strong>
                    ${escapeHTML(to)}
                  </p>
                </div>
              `
              : ""
          }
        </div>

        <table>
          <thead>
            <tr>
              ${columns
                .map(
                  (column) => `
                    <th>${escapeHTML(column.label)}</th>
                  `,
                )
                .join("")}
            </tr>
          </thead>

          <tbody>
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
                        <tr>
                          ${columns
                            .map(
                              (column) => `
                                <td class="${getCellClass(column, row)}">
                                  ${escapeHTML(
                                    formatValue(row[column.key], column.key),
                                  )}
                                </td>
                              `,
                            )
                            .join("")}
                        </tr>
                      `,
                    )
                    .join("")
                : `
                  <tr>
                    <td colspan="${columns.length}" class="emptyMessage">
                      No records found for this report.
                    </td>
                  </tr>
                `
            }
          </tbody>
        </table>
      </body>
    </html>
  `;
}

module.exports = createReportHTML;
