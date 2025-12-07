import { rest, http, HttpResponse } from 'msw';

// ✅ mockUsers를 SignUpHandlers 밖에서도 접근 가능하게 유지
export const mockUsers = [
  {
    id: 'existing_user',
    nickname: '홍길동',
    password: '1234',
    role: 'USER',
    created_at: '2025-08-01T10:00:00Z',
    last_login_at: '2025-08-04T15:30:00Z',
  },
];

// --- 1. 로그인/로그아웃 핸들러 (V2 통일) ---

export const loginHandlers = [
  rest.post('/api/login', async (req, res, ctx) => {
    const { username, password } = await req.json();

    console.log(`[MSW v1] 로그인 시도: ID=${username}, PW=${password}`);

    if ((username === 'test' || username === 'test1234') && password === '1234') {
      return res(
        ctx.status(200),
        ctx.json({
          message: '로그인 성공',
          user: {
            id: 1,
            username,
            nickname: '테스트유저',
            role: 'USER',
          },
          accessToken: 'fake-access-token-12345',
          refreshToken: 'fake-refresh-token-67890',
        })
      );
    }

    return res(ctx.status(401), ctx.json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' }));
  }),

  // ------------------------------------------------
  // [로그아웃 핸들러]
  // ------------------------------------------------
  rest.post('/api/logout', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ success: true, message: '로그아웃 성공' }));
  }),
];

// --- 2. 회원가입 핸들러 (V2 통일) ---

export const SignUpHandlers = [
  // 🔐 회원가입 처리
  rest.post('/api/signup', async ({ request }) => {
    const { id, nickname, password } = await request.json();

    if (!id || !nickname || !password) {
      return HttpResponse.json(
        { message: '아이디, 닉네임, 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    const exists = mockUsers.some((user) => user.id === id);
    if (exists) {
      return HttpResponse.json({ message: '이미 존재하는 아이디입니다.' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newUser = {
      id,
      nickname,
      password,
      role: 'USER',
      created_at: now,
      last_login_at: now,
    };

    mockUsers.push(newUser);

    return HttpResponse.json(
      {
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user_data: {
          id: newUser.id,
          nickname: newUser.nickname,
          role: newUser.role,
          created_at: newUser.created_at,
          last_login_at: newUser.last_login_at,
        },
      },
      { status: 201 }
    );
  }),

  // 🧐 아이디 중복 확인
  rest.post('/api/id/check', async ({ request }) => {
    const { id } = await request.json();

    if (!id || id.length < 4) {
      return HttpResponse.json({ message: '아이디는 4자 이상이어야 합니다.' }, { status: 400 });
    }

    const isDuplicated = mockUsers.some((user) => user.id === id);

    if (isDuplicated) {
      return HttpResponse.json({ message: '이미 존재하는 아이디입니다.' }, { status: 400 });
    }

    return HttpResponse.json({ message: '사용 가능한 아이디입니다.' }, { status: 200 });
  }),

  // ✅ 이메일 인증 코드 발송 (기존 코드 유지)
  rest.post('/api/email/send', async ({ request }) => {
    const body = await request.json();
    console.log('📨 [이메일 인증 요청] 요청 바디:', body);
    const { email } = body;

    if (email === 'existing@example.com') {
      return HttpResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return HttpResponse.json(
        { message: '이메일 형식이 잘못되었거나 누락되었습니다.' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ message: '인증 코드가 발송되었습니다.' }, { status: 200 });
  }),

  // ✅ 이메일 인증 코드 확인 (기존 코드 유지)
  rest.post('/api/email/verify', async ({ request }) => {
    const body = await request.json();
    console.log('📨 [이메일 인증 확인] 요청 바디:', body);
    const { email, code } = body;

    if (!email || !code) {
      return HttpResponse.json(
        { message: '이메일 형식이 잘못되었거나 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 🟢 테스트용: 이메일이 'test@example.com' + code 'ABC123' 일 때만 성공
    if (email === 'test@example.com' && code === 'ABC123') {
      return HttpResponse.json({ message: '이메일 인증 성공!' }, { status: 200 });
    }

    if (email === 'test@example.com') {
      return HttpResponse.json({ message: '인증 코드가 일치하지 않습니다.' }, { status: 400 });
    }

    return HttpResponse.json({ message: '인증 코드가 발송되지 않았습니다.' }, { status: 404 });
  }),
];

// --- 3. 유저 정보 핸들러 (V2 통일) ---

export const userHandlers = [
  rest.get('/users/me', () => {
    return HttpResponse.json(
      {
        user_data: {
          user_id: 1,
          role: 'USER',
          name: '홍길동',
          email: 'gildong@gmail.com',
          profile_image_url: 'https://profile.example.com/image.png',
          last_login_at: '2025-08-03T14:22:00Z', // ISO 포맷
        },
        error: null,
      },
      { status: 200 }
    );
  }),
];
