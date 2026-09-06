import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: () => Promise.resolve('[]'),
  });
});

afterEach(() => {
  delete global.fetch;
  localStorage.clear();
});

test('renders the home page with the search form', async () => {
  render(<App />);

  expect(screen.getByRole('link', { name: 'BookIT' })).toBeInTheDocument();
  expect(await screen.findByText('Find Your Perfect Stay')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

test('shows login and register links when signed out', async () => {
  render(<App />);

  expect(await screen.findByRole('link', { name: 'Login' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'My Reservations' })).not.toBeInTheDocument();
});
