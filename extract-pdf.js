const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:/Users/Admin/Documents/STRIVER/7_Ngay_Xay_Dung_Ban_Do_AI_Cho_Doanh_Nghiep (2).pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('C:/Users/Admin/Documents/STRIVER/pdf_content.txt', data.text);
    console.log("PDF Extracted!");
}).catch(function(err) {
    console.error(err);
});
