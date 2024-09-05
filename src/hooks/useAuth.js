import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

const useAuth = () => {
  const token = Cookies.get('token');

  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { firstName, lastName, email, photo, phone, role, id, hotels } = decoded;
    isAdmin = role === 'admin';

    return {
      firstName,
      lastName,
      email,
      photo,
      phone,
      role,
      id,
      isAdmin,
      isLoggedIn: true,
      hotels
    };
  }

  return {
    isAdmin: false,
    isLoggedIn: false,
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    phone: '',
    role: '',
    id: '',
    hotels: []
  };
};
export default useAuth;
