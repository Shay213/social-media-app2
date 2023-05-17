import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../state';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Props {
  friendId: string;
  name: string;
  subtitle: string;
  userPicturePath: string;
}

const Friend = ({ friendId, name, subtitle, userPicturePath }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend.id === friendId);

  const config = {
    withCredentials: true,
  };

  const patchFriend = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:8800/${id}/${friendId}`,
        config
      );
      dispatch(setFriends({ friends: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap='1rem'>
        <UserImage image={userPicturePath} size='55px' />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant='h5'
            fontWeight='500'
            sx={{
              '&:hover': { color: palette.primary.light, cursor: 'pointer' },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize='0.75rem'>
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: '0.6rem' }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
