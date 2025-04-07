const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    // 1. التحقق من وجود الملف
    const filePath = path.join(process.cwd(), 'src', 'assets', 'students.xlsx');
    console.log('مسار الملف:', filePath);
    
    if (!fs.existsSync(filePath)) {
      const dirContents = fs.readdirSync(path.join(process.cwd(), 'src', 'assets'));
      throw new Error(`الملف غير موجود. محتويات المجلد: ${dirContents.join(', ')}`);
    }

    // 2. معالجة الـ IDs
    const { ids } = JSON.parse(event.body);
    if (!ids || !Array.isArray(ids)) {
      throw new Error('يجب إرسال مصفوفة من الـ IDs');
    }

    // 3. قراءة ملف Excel
    const workbook = XLSX.readFile(filePath);
    const studentsData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    console.log('عدد السجلات:', studentsData.length);

    // 4. تصفية النتائج
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
    console.error('تفاصيل الخطأ:', {
      message: error.message,
      stack: error.stack,
      rawError: error
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        fullError: error.stack,
        dirContents: fs.readdirSync(path.join(process.cwd(), 'src', 'assets'))
      })
    };
  }
};
