import Cookies from 'universal-cookie';

export function save(user, login) {
  const cookies = new Cookies();
  cookies.set('user', JSON.stringify({ uid: user.id, isLogin: login }), {
    path: '/',
  });
}
export function remove() {
  const cookies = new Cookies();
  cookies.remove('user', {
    path: '/',
    expire: Date.now(),
  });
}
