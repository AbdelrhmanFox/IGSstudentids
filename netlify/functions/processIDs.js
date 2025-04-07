// netlify/functions/processIDs.js
const XLSX = require('xlsx');
const path = require('path');

exports.handler = async (event) => {
  try {
    const ids = JSON.parse(event.body).ids;
    
    if (!ids || !Array.isArray(ids)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'يجب إرسال مصفوفة من الـ IDs' })
      };
    }

    if (ids.length > 500) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'الحد الأقصى هو 500 ID في المرة' })
      };
    }

    // قراءة ملف Excel
    const filePath = path.join(process.cwd(), 'src/assets/students.xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const studentsData = XLSX.utils.sheet_to_json(worksheet);

    const found = studentsData.filter(student => ids.includes(student.ID));
    const notFound = ids.filter(id => !studentsData.some(student => student.ID === id));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        found_count: found.length,
        not_found_count: notFound.length,
        data: found,
        not_found_ids: notFound
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};