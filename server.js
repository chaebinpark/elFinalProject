const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// 정적 파일 제공 (이미지 및 CSS, JS 파일 등)
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 폴더를 정적 파일 제공 폴더로 설정

// 루트 경로 핸들러
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // index.html 파일 경로 수정
});

// 방명록 항목 추가
app.post('/api/entries', (req, res) => {
    const newEntry = req.body;

    // guestbook.json 파일 경로
    const filePath = path.join(__dirname, 'guestbook.json');

    // 파일에서 기존 데이터 읽기
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }

        const entries = JSON.parse(data);
        entries.push(newEntry);

        // 파일에 새로운 데이터 쓰기
        fs.writeFile(filePath, JSON.stringify(entries, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save data' });
            }
            res.status(201).json(newEntry);
        });
    });
});

// 방명록 조회
app.get('/api/entries', (req, res) => {
    const filePath = path.join(__dirname, 'guestbook.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
