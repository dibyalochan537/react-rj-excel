# react-rj-excel

Download Excel files from React by **row and column position**. Values fill exactly the cell you choose, empty cells below can be merged automatically, and the download button is fully customizable.

## Install

```bash
npm install react-rj-excel
```

## Quick start

```jsx
import { ExcelDownloadButton } from "react-rj-excel";

export default function App() {
  return (
    <ExcelDownloadButton
      label="Download students"
      headers={["id", "name", "subject"]}
      rows={{
        1: [1, "raju", "math"],
        2: [null, null, "english"],
        3: [2, "sita", "science"],
      }}
      mergeDown={[0, 1]}
    />
  );
}
```

Row 2 only fills the `subject` column, so `english` appears directly under `math`, and `1` and `raju` are merged across both rows.

## Row formats

```js
rows={{ 1: [1, "raju", "math"] }}            // array by column index
rows={{ 2: [, , "english"] }}                // sparse array
rows={{ 2: { 2: "english" } }}               // object by column index
rows={{ 2: { subject: "english" } }}         // object by header name
rows={[[1, "raju", "math"], [null, null, "english"]]}  // plain array of rows
```

## Button examples

```jsx
<ExcelDownloadButton label="Solid" color="#059669" headers={h} rows={r} />

<ExcelDownloadButton
  label="Gradient"
  gradient={["#f97316", "#ec4899", "#8b5cf6"]}
  gradientDirection="bottom-right"
  headers={h} rows={r}
/>

<ExcelDownloadButton label="Icon right" iconPosition="right" headers={h} rows={r} />
<ExcelDownloadButton label="Download" iconPosition="only" headers={h} rows={r} />
```

Load data only when clicked:

```jsx
<ExcelDownloadButton
  getData={async () => {
    const res = await fetch("/api/students");
    return { headers: [...], rows: await res.json(), fileName: "students.xlsx" };
  }}
/>
```

## Props: Excel data

| Prop | Type | Default | Description |
|---|---|---|---|
| `headers` | `string[]` | required | Column titles |
| `rows` | object or array | `{}` | Row number to values by column |
| `fileName` | `string` | `export.xlsx` | Downloaded file name |
| `sheetName` | `string` | `Sheet1` | Sheet tab name |
| `sheetTheme` | `blue`, `green`, `dark`, `minimal` | `blue` | Colors inside the Excel file |
| `mergeDown` | `number[]` | `[]` | Column indexes to merge downward |
| `freezeHeader` | `boolean` | `true` | Keep header visible while scrolling |
| `getData` | `() => object` | none | Load data on click (can be async) |

## Props: Button

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | `Download Excel` |
| `color` | any CSS color | `#2563EB` |
| `textColor` | any CSS color | white (or `color` for outline) |
| `gradient` | array of 2 to 3 colors | none |
| `gradientDirection` | `right`, `left`, `top`, `bottom`, `top-right`, `top-left`, `bottom-right`, `bottom-left`, or degrees like `45` | `right` |
| `variant` | `solid`, `outline` | `solid` |
| `size` | `sm`, `md`, `lg` | `md` |
| `borderRadius` | number or string | `8` |
| `icon` | React node or `false` | built-in download icon |
| `iconPosition` | `left`, `right`, `only` | `left` |
| `fullWidth` | `boolean` | `false` |
| `loadingText` | `string` | same as `label` |
| `disabled` | `boolean` | `false` |
| `className`, `style` | | override anything |
| `onSuccess` | `() => void` | |
| `onError` | `(error) => void` | |

A custom `icon` (for example from lucide-react) is sized by you, and the `size` prop only affects the built-in icon.

## Hook and function

```jsx
import { useExcelDownload, downloadExcel } from "react-rj-excel";

const { download, loading, error } = useExcelDownload();
download({ headers, rows, fileName: "report.xlsx" });

// or without React state
await downloadExcel({ headers, rows });
```

## License

MIT