export const verificationMailTemplate = (
  code: string,
  expiryMinutes: number,
  brandName: string,
) => {
  return `
    <!doctype html>
    <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${brandName} 인증번호 안내</title>
      <style>
        body { margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial; background:#f5f7fb; color:#111827; }
        .container { max-width:640px; margin:28px auto; background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(15,23,42,0.06); overflow:hidden; }
        .header { padding:20px 28px; background: linear-gradient(90deg,#2563eb 0%,#06b6d4 100%); color:#fff; font-size:18px; font-weight:600; text-align:center; }
        .content { padding:28px; line-height:1.5; font-size:16px; text-align:center; }
        .code-box { display:inline-block; font-size:28px; letter-spacing:8px; font-weight:700; color:#0f172a; background:#f3f4f6; border-radius:8px; padding:18px 24px; margin:18px 0; }
        .btn { display:inline-block; text-decoration:none; padding:12px 24px; border-radius:10px; background-color:#2563eb; color:#fff; font-weight:600; margin-top:8px; }
        .note { margin-top:18px; font-size:13px; color:#6b7280; }
        .footer { padding:18px 28px; font-size:13px; color:#9ca3af; background:#fbfdff; text-align:center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">${brandName}</div>
        <div class="content">
          <p>안녕하세요. 요청하신 인증번호를 확인해주세요.</p>
          <p>해당 인증번호는 <strong>${expiryMinutes}분</strong> 동안 유효합니다.</p>
          <div class="code-box" aria-live="polite" aria-atomic="true">${code}</div>
          <p class="note">
            인증 요청을 하지 않으셨다면 이 메일을 무시하세요.<br/>
            문제가 있으면 ${brandName} 고객센터로 문의해주세요.
          </p>
        </div>
        <div class="footer">© ${brandName}. All rights reserved.</div>
      </div>
    </body>
    </html>
    `;
};
