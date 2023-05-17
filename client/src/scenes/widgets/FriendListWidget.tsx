import { Box, Typography, useTheme } from '@mui/material';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../../state';
import axios from 'axios';

interface IFriend {
  id: string;
  firstName: string;
  lastName: string;
  occupation: string;
  location: string;
  picturePath: string;
  userId: string;
}

const FriendListWidget = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    const res = await axios.get(
      `http://localhost:8800/api/users/${userId}/friends`,
      { withCredentials: true }
    );
    dispatch(setFriends({ friends: res.data }));
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant='h5'
        fontWeight='500'
        sx={{ mb: '1.5rem' }}
      >
        Friend List
      </Typography>
      <Box display='flex' flexDirection='column' gap='1.5rem'>
        {friends.map((friend: IFriend) => (
          <Friend
            key={friend.id}
            friendId={friend.id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
