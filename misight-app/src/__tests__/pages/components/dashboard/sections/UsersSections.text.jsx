import { UsersSection } from '../../../../components/dashboard/sections/UsersSection';

describe('UsersSection', () => {
 test('renders add user button', () => {
   render(<UsersSection />);
   expect(screen.getByText('Add User')).toBeInTheDocument();
 });

 test('opens modal on add button click', () => {
   render(<UsersSection />);
   fireEvent.click(screen.getByText('Add User'));
   expect(screen.getByText('User Management')).toBeInTheDocument();
 });
});