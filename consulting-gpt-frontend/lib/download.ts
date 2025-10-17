export type CsvValue = string | number | boolean | null | undefined;

export type CsvRow = Record<string, CsvValue>;

const normalizeValue = (value: CsvValue): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value).replace(/\r?\n|\r/g, ' ').trim();
  const needsQuoting = /[",\n]/.test(stringValue);

  if (needsQuoting) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const buildCsvContent = (rows: CsvRow[], headers?: string[]): string => {
  if (!rows.length) {
    return '';
  }

  const uniqueHeaders =
    headers && headers.length
      ? headers
      : Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  const headerLine = uniqueHeaders.map((header) => normalizeValue(header)).join(',');
  const dataLines = rows.map((row) =>
    uniqueHeaders.map((header) => normalizeValue(row[header])).join(',')
  );

  return [headerLine, ...dataLines].join('\n');
};

export const downloadCsv = (filename: string, rows: CsvRow[], headers?: string[]) => {
  if (!rows.length) {
    return;
  }

  const csvContent = buildCsvContent(rows, headers);
  if (!csvContent) {
    return;
  }

  // BOM for Excel
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
