import User from '../../models/User';

export async function createUser() {
  const user = await User.create({});
  return user;
}
