import { renderWithProviders, screen } from './test-utils';
import UsersTable from '../components/admin/UsersTable';

const sampleUsers = [
  { id: 1, name: 'Active Annie', role: 'aspirant', isBlocked: false, profilePicture: null },
  { id: 2, name: 'Blocked Ben', role: 'voter', isBlocked: true, profilePicture: null },
];

describe('UsersTable', () => {
  it('renders an empty state when there are no users', () => {
    renderWithProviders(<UsersTable users={[]} />);
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('renders a row per user with name and role', () => {
    renderWithProviders(<UsersTable users={sampleUsers} />);

    expect(screen.getByText('Active Annie')).toBeInTheDocument();
    expect(screen.getByText('aspirant')).toBeInTheDocument();
    expect(screen.getByText('Blocked Ben')).toBeInTheDocument();
    expect(screen.getByText('voter')).toBeInTheDocument();
  });

  it('shows Active / Blocked status chips based on isBlocked', () => {
    renderWithProviders(<UsersTable users={sampleUsers} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });
});
