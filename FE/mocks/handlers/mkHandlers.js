import { rest, HttpResponse } from 'msw';
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

export const loginHandlers = [
  // 로그인
  rest.post('/api/login', async (req, res, ctx) => {
    const { id, password } = await req.json(); // ✅ 올바른 req 객체 사용

    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return res(ctx.status(404), ctx.json({ message: '존재하지 않는 사용자입니다.' }));
    }

    if (user.password !== password) {
      return res(ctx.status(401), ctx.json({ message: '아이디 또는 비밀번호가 틀렸습니다.' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user_data: {
          id: user.id,
          nickname: user.nickname,
          role: 'USER',
          created_at: user.created_at,
          last_login_at: new Date().toISOString(),
        },
      })
    );
  }),
  // 로그아웃
  rest.post('/api/logout', async (req, res, ctx) => {
    // accessToken 검증 생략 (MSW니까)
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        message: '로그아웃 성공',
      })
    );
  }),
];

export const SignUpHandlers = [
  // 🔐 회원가입 처리
  rest.post('/api/signup', async (req, res, ctx) => {
    const { id, nickname, password } = await req.json();

    if (!id || !nickname || !password) {
      return res(ctx.status(400), ctx.json({ message: '아이디, 닉네임, 비밀번호는 필수입니다.' }));
    }

    const exists = mockUsers.some((user) => user.id === id);
    if (exists) {
      return res(ctx.status(400), ctx.json({ message: '이미 존재하는 아이디입니다.' }));
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

    return res(
      ctx.status(201),
      ctx.json({
        accessToken: 'fake-access-token',
        refreshToken: 'fake-refresh-token',
        user_data: {
          id: newUser.id,
          nickname: newUser.nickname,
          role: newUser.role,
          created_at: newUser.created_at,
          last_login_at: newUser.last_login_at,
        },
      })
    );
  }),

  // 🧐 아이디 중복 확인
  rest.post('/api/id/check', async (req, res, ctx) => {
    const { id } = await req.json();

    if (!id || id.length < 4) {
      return res(ctx.status(400), ctx.json({ message: '아이디는 4자 이상이어야 합니다.' }));
    }

    const isDuplicated = mockUsers.some((user) => user.id === id);

    if (isDuplicated) {
      return res(ctx.status(400), ctx.json({ message: '이미 존재하는 아이디입니다.' }));
    }

    return res(ctx.status(200), ctx.json({ message: '사용 가능한 아이디입니다.' }));
  }),
];

// 유저 정보 조회
export const userHandlers = [
  rest.get('/users/me', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user_data: {
          user_id: 1,
          role: 'USER',
          name: '홍길동',
          email: 'gildong@gmail.com',
          profile_image_url: 'https://profile.example.com/image.png',
          last_login_at: '2025-08-03T14:22:00Z', // ISO 포맷
        },
        error: null,
      })
    );
  }),
];
