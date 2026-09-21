import { useState } from "react";
import { ExcelDownloadButton } from "./lib/index.js";

const headers = ["id", "name", "subject"];

export default function App() {
  const [rows, setRows] = useState({
    1: [1, "raju", "math"],
    2: [null, null, "english"],
  });

  const addStudent = () => {
    const next = Object.keys(rows).length + 1;
    setRows({ ...rows, [next]: [next, "new student", "science"] });
  };

  return (
    <div style={{ padding: 24, display: "grid", gap: 16, maxWidth: 420 }}>
      <h2>react-rj-excel playground</h2>

      {/* 1. default look */}
      <ExcelDownloadButton headers={headers} rows={rows} mergeDown={[0, 1]} />

      {/* 2. solid color, custom label */}
      <ExcelDownloadButton
        label="Export Students"
        color="#059669"
        headers={headers}
        rows={rows}
        fileName="students"
        sheetTheme="green"
        mergeDown={[0, 1]}
      />

      {/* 3. gradient with 3 colors and a direction */}
      <ExcelDownloadButton
        label="Gradient"
        gradient={["#f97316", "#ec4899", "#8b5cf6"]}
        gradientDirection="bottom-right"
        borderRadius={999}
        headers={headers}
        rows={rows}
        mergeDown={[0, 1]}
      />

      {/* 4. icon on the right, outline */}
      <ExcelDownloadButton
        label="Outline"
        variant="outline"
        color="#2563EB"
        iconPosition="right"
        headers={headers}
        rows={rows}
      />

      {/* 5. icon only (centered) */}
      <ExcelDownloadButton
        label="Download students"
        iconPosition="only"
        color="#111827"
        borderRadius={999}
        headers={headers}
        rows={rows}
      />

      {/* 6. no icon, full width, loading text */}
      <ExcelDownloadButton
        label="No icon"
        icon={false}
        fullWidth
        loadingText="Preparing..."
        headers={headers}
        rows={rows}
      />

      {/* 7. load data only when clicked (like an API call) */}
      <ExcelDownloadButton
        label="Load on click"
        getData={async () => {
          await new Promise((r) => setTimeout(r, 800));
          return { headers, rows, fileName: "from-api.xlsx" };
        }}
        onSuccess={() => console.log("downloaded")}
        onError={(e) => alert(e.message)}
      />

      <button onClick={addStudent}>+ Add student (test dynamic data)</button>
    </div>
  );
}