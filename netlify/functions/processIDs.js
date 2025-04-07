const XLSX = require('xlsx');
const path = require('path');

exports.handler = async (event) => {
  try {
    // تحقق من وجود الملف أولاً
    const filePath = path.join(__dirname, '..', '..', 'src', 'assets', 'students.xlsx');
    console.log('محاولة قراءة الملف من:', filePath);
    
    const ids = JSON.parse(event.body).ids;
    
    // باقي الكود كما هو...
    
    // قراءة ملف Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const studentsData = XLSX.utils.sheet_to_json(worksheet);
    console.log('تم تحميل عدد من السجلات:', studentsData.length);

    // باقي الكود...
  } catch (error) {
    console.error('حدث خطأ:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        path: filePath,
        dirContents: require('fs').readdirSync(path.join(__dirname, '..', '..', 'src', 'assets'))
      })
    };
  }
};
