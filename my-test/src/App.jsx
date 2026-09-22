import { ExcelDownloadButton } from "react-rj-excel";
// Running inside the package's own playground? Use: import { ExcelDownloadButton } from "./lib";

const headers = ["id", "name", "subject"];

const rows = {
  1: [1, "raju", "math"],
  2: [null, null, "english"],
  3: [2, "sita", "science"],
  4: [null, null, "history"],
  5: [3, "amit", "physics"],
};

function App() {
  return (
    <div style={{ padding: 40 }}>
      <ExcelDownloadButton
        label="Download students"
        headers={headers}
        rows={rows}
        mergeDown={[0, 1]}
        fileName="students.xlsx"
      />
    </div>
  );
}

export default App;