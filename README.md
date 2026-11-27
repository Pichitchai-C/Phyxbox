# PhyxBox

เว็บไซต์จำลองห้องปฏิบัติการฟิสิกส์ 3 มิติ สำหรับ ม.4–ม.6 (ต้นแบบบทที่ 1: พื้นเอียงและกฎของนิวตัน)

## วิธีรัน
ไฟล์ใช้ ES Modules จึงดับเบิลคลิก `index.html` ตรง ๆ ไม่ได้ ต้องเปิดผ่านเซิร์ฟเวอร์:

    cd PhyxBox
    python -m http.server 8000

แล้วเปิด http://localhost:8000 (หรือใช้ส่วนเสริม Live Server ใน VS Code) ต้องต่ออินเทอร์เน็ตเพราะโหลด Three.js และ KaTeX จาก CDN

## ขึ้น GitHub

    git init
    git add .
    git commit -m "PhyxBox prototype"
    git branch -M main
    git remote add origin https://github.com/<ชื่อผู้ใช้>/PhyxBox.git
    git push -u origin main

เปิดเว็บฟรีด้วย GitHub Pages: Settings → Pages → Branch: `main` / `(root)` → Save

## โครงสร้าง
- `js/main.js` ควบคุมหลัก สลับโหมดทดลอง/ข้อสอบ
- `js/lab3d.js` ฉาก Three.js (พื้นเอียง กล่อง ลูกศรแรง)
- `js/physicsEngine.js` ฟิสิกส์พื้นเอียง (เปลี่ยน g ที่บรรทัดที่ 1)
- `js/formulaManager.js` ระบบวิวัฒนาการสูตร (KaTeX)
- `js/scratchpad.js` กระดานทด
- `js/data/curriculum.js` เนื้อหา สูตรลัด Hint
- `js/data/challenges.js` โจทย์ข้อสอบ

## ขั้นต่อไป
- เพิ่มบทเรียนใหม่ใน `curriculum.js` และโจทย์ใน `challenges.js`
- บทที่ต้องมีการชน (โมเมนตัม) ค่อยเพิ่ม Cannon-es / Rapier
