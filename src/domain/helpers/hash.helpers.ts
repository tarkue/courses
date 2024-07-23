import * as bcrypt from 'bcrypt';

export async function getPasswordHash(password: string) {
  const salt = await bcrypt.genSalt();
  const hashed_password = await bcrypt.hash(password, salt);
  return hashed_password;
}
