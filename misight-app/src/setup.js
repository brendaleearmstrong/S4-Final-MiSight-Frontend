
import "@testing-library/jest-dom";
import "whatwg-fetch";
import { server } from "../mocks/server";
import '@testing-library/jest-dom/extend-expect';
import 'whatwg-fetch';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());