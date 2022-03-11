import { utils, write, writeFile } from 'xlsx';

export const convertJsonToExcel = (data: any) => {
  const workSheet = utils.json_to_sheet(data);
  const workBook = utils.book_new();

  utils.book_append_sheet(workBook, workSheet, 'download');
  // Generate buffer
  write(workBook, { bookType: 'xlsx', type: 'buffer' });

  // Binary string
  write(workBook, { bookType: 'xlsx', type: 'binary' });

  writeFile(workBook, `download.xlsx`);
};
