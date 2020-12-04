import { Buffer } from 'buffer';
import Keygrip from 'keygrip';
import keys from '../../config/keys';

export async function createSession(user: { _id: any }) {
  const { cookieKey } = keys;

  const sessionObjectJson = JSON.stringify({
    passport: {
      user: user._id.toString(),
    },
  });

  const session = Buffer.from(sessionObjectJson).toString('base64');

  const keygrip = new Keygrip([cookieKey]);
  const sessionSig = keygrip.sign('session=' + session);

  return {
    session,
    sessionSig,
  };
}
