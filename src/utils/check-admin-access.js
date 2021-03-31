import { getSession } from 'next-auth/client';

export default async function checkAdminAccess({ req } = {}) {
  const session = await getSession({ req });

  if (session?.user?.role === 'admin') {
    return true;
  }

  return false;
}
