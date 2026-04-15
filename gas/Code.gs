/**
 * DanielFlow Comment — Apps Script 백엔드
 *
 * 배포:
 * 1. https://script.google.com 에서 새 프로젝트 생성
 * 2. 이 파일 내용 전체 붙여넣기
 * 3. SHEET_ID 는 이미 DanielFlow_피드백_마스터 로 설정됨
 * 4. 배포 > 새 배포 > 유형: 웹 앱
 *    - 액세스: 모든 사용자 (익명 허용)
 *    - 실행: 나
 * 5. 생성된 웹 앱 URL을 comment.js 의 ENDPOINT 에 저장
 */

const SHEET_ID = '1d6EQbdNknJzpNnctSSNnp052v3aq241EwVDyjbciia4';
const SHEET_NAME = '시트1';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const row = [
      new Date(),
      payload.project || '',
      payload.page || '',
      payload.pageUrl || '',
      payload.section || '',
      payload.author || '',
      payload.rating || '',
      payload.comment || '',
      '대기',
      payload.note || ''
    ];
    sheet.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const project = (e.parameter.project || '').trim();
  const pageUrl = (e.parameter.pageUrl || '').trim();
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const comments = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (project && r[1] !== project) continue;
    if (pageUrl && r[3] !== pageUrl) continue;
    comments.push({
      timestamp: r[0],
      project: r[1],
      page: r[2],
      section: r[4],
      author: r[5],
      rating: r[6],
      comment: r[7],
      status: r[8]
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, count: comments.length, comments: comments.reverse() }))
    .setMimeType(ContentService.MimeType.JSON);
}
