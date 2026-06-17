import { useSelector } from 'react-redux';
import { FiHome } from 'react-icons/fi';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import profile from "../assets/profile.png"

type RootState = {
  user: {
    value: {
      id: string | null;
      name: string | null;
      email: string | null;
      access_token: string | null;
    };
  };
};

const AccountPage = () => {
  // Sample data, replace with your actual data
  const userdata = useSelector((state: RootState) => state.user.value);

  

 

  return (
    <>
      <Header />
      <section className="relative pb-16 pt-28 sm:pb-24 sm:pt-36">
        <img src="https://pagedone.io/asset/uploads/1705471739.png" alt="cover-image" className="absolute left-0 top-0 z-0 h-52 w-full object-cover sm:h-60" />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-center relative z-10 mb-2.5">
            <img src={profile} alt="user avatar" className="w-32 rounded-full border-4 border-solid border-white sm:w-40" />
          </div>
          <div className="mb-5 flex flex-col items-center justify-center gap-4">
            <ul className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
              <li>
                <a href="/" className="flex items-center gap-2 font-medium leading-7 text-gray-900 hover:text-[#9a6514]">
                  <FiHome className="h-5 w-5" />
                  Home
                </a>
              </li>
              <li className="text-gray-300">/</li>
              <li className="font-medium leading-7 text-gray-500">Account</li>
              <li className="text-gray-300">/</li>
              <li className="font-medium leading-7 text-gray-500">Profile</li>
            </ul>

          </div>
          <h3 className="mb-3 break-words text-center font-manrope text-2xl font-bold leading-9 text-gray-900 sm:text-3xl sm:leading-10">{userdata.name}</h3>
          <p className="mb-8 break-all text-center text-base font-normal leading-7 text-gray-500">{userdata.email}</p>
         
        </div>
      </section>



      <Footer />
    </>

  );
};

export default AccountPage;
