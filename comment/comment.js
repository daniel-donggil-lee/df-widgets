/**
 * DanielFlow Comment Widget
 *
 * 사용법:
 *   <script src="https://daniel-donggil-lee.github.io/df-widgets/comment/comment.js"
 *           data-project="펜타캠퍼스"
 *           data-page="랜딩"></script>
 *
 * 속성:
 *   data-project (필수) — 프로젝트명
 *   data-page    (선택) — 페이지명 (미지정 시 document.title)
 *   data-endpoint (선택) — Apps Script URL 오버라이드
 */
(function () {
  'use strict';

  const SCRIPT = document.currentScript;
  const PROJECT = SCRIPT.dataset.project || '미지정';
  const PAGE = SCRIPT.dataset.page || document.title || '미지정';
  const ENDPOINT = SCRIPT.dataset.endpoint ||
    'https://script.google.com/macros/s/AKfycbyNPmGnm01-Jp3G4WNQl2M-84Cjl5WB4Tbgr0os1crZOjUXNnFXnm5d-g46-2JA8iR_/exec';

  const STORAGE_KEY = 'dfc_author';

  // --- STYLES ---
  const css = `
.dfc-btn{position:fixed;right:24px;bottom:24px;z-index:999998;background:#0a0a0a;color:#C9A84C;border:0;border-radius:999px;padding:14px 22px;font-family:'Pretendard',-apple-system,sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;transition:transform .15s}
.dfc-btn:hover{transform:translateY(-2px)}
.dfc-btn .dfc-badge{background:#C9A84C;color:#0a0a0a;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:800;min-width:22px;text-align:center}
.dfc-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999999;display:none;align-items:center;justify-content:center;font-family:'Pretendard',-apple-system,sans-serif}
.dfc-overlay.open{display:flex}
.dfc-modal{background:#fff;border-radius:18px;max-width:560px;width:calc(100% - 32px);max-height:88vh;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,.25)}
.dfc-head{padding:24px 28px 16px;border-bottom:1px solid #e8e8e8;display:flex;justify-content:space-between;align-items:center}
.dfc-head h3{margin:0;font-size:18px;font-weight:800;color:#0a0a0a;letter-spacing:-.01em}
.dfc-head .dfc-close{background:none;border:0;font-size:22px;cursor:pointer;color:#6b6b6b}
.dfc-body{padding:22px 28px}
.dfc-meta{font-size:12px;color:#6b6b6b;margin-bottom:16px;background:#faf8f2;padding:10px 12px;border-radius:8px}
.dfc-meta b{color:#0a0a0a}
.dfc-row{margin-bottom:14px}
.dfc-row label{display:block;font-size:12px;font-weight:700;color:#0a0a0a;margin-bottom:6px;letter-spacing:.02em}
.dfc-row input,.dfc-row textarea,.dfc-row select{width:100%;padding:11px 13px;border:1px solid #e8e8e8;border-radius:10px;font-size:14px;font-family:inherit;color:#0a0a0a;box-sizing:border-box;background:#fff}
.dfc-row input:focus,.dfc-row textarea:focus,.dfc-row select:focus{outline:none;border-color:#C9A84C}
.dfc-row textarea{resize:vertical;min-height:100px;line-height:1.5}
.dfc-rating{display:flex;gap:8px}
.dfc-rating button{flex:1;padding:10px;border:1px solid #e8e8e8;border-radius:10px;background:#fff;cursor:pointer;font-size:13px;font-weight:600;color:#6b6b6b;transition:all .1s;font-family:inherit}
.dfc-rating button.on{background:#0a0a0a;color:#C9A84C;border-color:#0a0a0a}
.dfc-foot{padding:16px 28px 24px;display:flex;gap:10px;justify-content:flex-end}
.dfc-foot button{padding:12px 24px;border-radius:999px;border:0;font-weight:700;cursor:pointer;font-size:14px;font-family:inherit}
.dfc-cancel{background:#f2f2f2;color:#0a0a0a}
.dfc-submit{background:#C9A84C;color:#fff}
.dfc-submit:disabled{opacity:.4;cursor:not-allowed}
.dfc-list{border-top:1px solid #e8e8e8;padding:18px 28px;max-height:240px;overflow:auto}
.dfc-list h4{margin:0 0 12px;font-size:12px;font-weight:800;color:#6b6b6b;letter-spacing:.08em;text-transform:uppercase}
.dfc-item{padding:10px 12px;background:#faf8f2;border-radius:8px;margin-bottom:8px;font-size:13px;color:#333}
.dfc-item .dfc-ih{display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px;color:#6b6b6b}
.dfc-item .dfc-ih b{color:#0a0a0a}
.dfc-toast{position:fixed;bottom:90px;right:24px;background:#0a0a0a;color:#fff;padding:12px 18px;border-radius:10px;font-family:inherit;font-size:13px;z-index:1000000;animation:dfcFade 3s forwards}
@keyframes dfcFade{0%{opacity:0;transform:translateY(10px)}10%{opacity:1;transform:none}90%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}
@media(max-width:520px){.dfc-btn{right:16px;bottom:16px;padding:12px 18px}.dfc-modal{border-radius:14px}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- BUTTON ---
  const btn = document.createElement('button');
  btn.className = 'dfc-btn';
  btn.innerHTML = '💬 댓글 <span class="dfc-badge" data-count>0</span>';
  document.body.appendChild(btn);

  // --- MODAL ---
  const overlay = document.createElement('div');
  overlay.className = 'dfc-overlay';
  overlay.innerHTML = `
    <div class="dfc-modal" role="dialog">
      <div class="dfc-head">
        <h3>피드백 남기기</h3>
        <button class="dfc-close" aria-label="닫기">✕</button>
      </div>
      <div class="dfc-body">
        <div class="dfc-meta">📄 <b>${escapeHtml(PROJECT)}</b> · ${escapeHtml(PAGE)}</div>
        <div class="dfc-row">
          <label>작성자</label>
          <select class="dfc-author">
            <option value="이은경 대표">이은경 대표</option>
            <option value="이동길">이동길</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div class="dfc-row">
          <label>어느 부분에 대한 의견인가요? (선택)</label>
          <input type="text" class="dfc-section" placeholder="예: Hero 섹션, 6과정 그리드, 마스터 번들..."/>
        </div>
        <div class="dfc-row">
          <label>전체 평가</label>
          <div class="dfc-rating">
            <button type="button" data-r="좋음">👍 좋음</button>
            <button type="button" data-r="의견있음">🤔 의견있음</button>
            <button type="button" data-r="별로">🚫 별로</button>
          </div>
        </div>
        <div class="dfc-row">
          <label>코멘트</label>
          <textarea class="dfc-comment" placeholder="자유롭게 의견을 남겨주세요."></textarea>
        </div>
      </div>
      <div class="dfc-foot">
        <button class="dfc-cancel">취소</button>
        <button class="dfc-submit">피드백 제출</button>
      </div>
      <div class="dfc-list" style="display:none">
        <h4>💬 이전 피드백</h4>
        <div class="dfc-list-body"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const $ = (s) => overlay.querySelector(s);
  const authorEl = $('.dfc-author');
  const sectionEl = $('.dfc-section');
  const commentEl = $('.dfc-comment');
  const submitBtn = $('.dfc-submit');
  const listEl = $('.dfc-list');
  const listBody = $('.dfc-list-body');
  const ratingBtns = overlay.querySelectorAll('.dfc-rating button');
  let rating = '';

  // Restore author
  const savedAuthor = localStorage.getItem(STORAGE_KEY);
  if (savedAuthor) {
    [...authorEl.options].forEach(o => { if (o.value === savedAuthor) authorEl.value = savedAuthor; });
  }

  ratingBtns.forEach(b => b.addEventListener('click', () => {
    ratingBtns.forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    rating = b.dataset.r;
  }));

  btn.addEventListener('click', () => {
    overlay.classList.add('open');
    loadComments();
  });
  $('.dfc-close').addEventListener('click', close);
  $('.dfc-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  function close() { overlay.classList.remove('open'); }

  submitBtn.addEventListener('click', async () => {
    const comment = commentEl.value.trim();
    if (!comment) { alert('코멘트를 입력해주세요.'); return; }
    submitBtn.disabled = true;
    const body = {
      project: PROJECT,
      page: PAGE,
      pageUrl: location.href,
      section: sectionEl.value.trim(),
      author: authorEl.value,
      rating: rating,
      comment: comment
    };
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(body)
      });
      localStorage.setItem(STORAGE_KEY, authorEl.value);
      toast('피드백이 제출되었습니다. 감사합니다!');
      commentEl.value = '';
      sectionEl.value = '';
      ratingBtns.forEach(x => x.classList.remove('on'));
      rating = '';
      close();
      setTimeout(loadCount, 800);
    } catch (err) {
      alert('제출 실패: ' + err.message);
    } finally {
      submitBtn.disabled = false;
    }
  });

  async function loadCount() {
    try {
      const url = `${ENDPOINT}?project=${encodeURIComponent(PROJECT)}&pageUrl=${encodeURIComponent(location.href)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) btn.querySelector('[data-count]').textContent = data.count;
    } catch (e) {}
  }

  async function loadComments() {
    try {
      const url = `${ENDPOINT}?project=${encodeURIComponent(PROJECT)}&pageUrl=${encodeURIComponent(location.href)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok && data.comments.length) {
        listEl.style.display = 'block';
        listBody.innerHTML = data.comments.slice(0, 10).map(c => `
          <div class="dfc-item">
            <div class="dfc-ih">
              <b>${escapeHtml(c.author)}</b>
              <span>${c.rating || ''} · ${formatDate(c.timestamp)}</span>
            </div>
            ${c.section ? `<div style="color:#6b6b6b;font-size:11px;margin-bottom:4px">${escapeHtml(c.section)}</div>` : ''}
            <div>${escapeHtml(c.comment)}</div>
          </div>
        `).join('');
      } else {
        listEl.style.display = 'none';
      }
    } catch (e) {}
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'dfc-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function formatDate(ts) {
    try {
      const d = new Date(ts);
      return d.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  loadCount();
})();
