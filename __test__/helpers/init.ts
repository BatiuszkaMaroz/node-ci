import { dbConnect } from '../../services/database';

jest.setTimeout(30000);

beforeAll(async () => {
  await dbConnect();
});
