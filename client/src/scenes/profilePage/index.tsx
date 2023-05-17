import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../navbar';
import MyPostWidget from '../widgets/MyPostWidget';
import PostsWidget from '../widgets/PostsWidget';
import UserWidget from '../widgets/UserWidget';
import axios from 'axios';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  picturePath: string;
  location: string;
  occupation: string;
  viewedProfile: string;
  impressions: string;
  updatedAt: string;
  createdAt: string;
}

const ProfilePage = () => {
  /* const [user, setUser] = useState<IUser | null>(null);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/users/${userId}`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!user || !userId) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap='2rem'
        justifyContent='center'
      >
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m='2rem 0' />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <MyPostWidget picturePath={user.picturePath} />
          <Box m='2rem 0' />
          <PostsWidget userId={userId} isProfile={true} />
        </Box>
      </Box>
    </Box>
  );*/
};

export default ProfilePage;
