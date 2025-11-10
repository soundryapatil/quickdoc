import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hero heading', () => {
  render(<App />);
  const heading = screen.getByText(/Book Appointment With Trusted Doctors/i);
  expect(heading).toBeInTheDocument();
});
