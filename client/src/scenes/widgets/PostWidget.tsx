import { Post } from './PostsWidget';
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '../../state';
import axios from 'axios';

const PostWidget = ({ post }: { post: Post }) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user.id);
  const isLiked = post.likes.find((like) => like.userId === loggedInUserId);
  const likeCount = post.likes.length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const config = {
    withCredentials: true,
  };

  const patchLike = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:8800/posts/${post.id}/like`,
        { userId: loggedInUserId },
        config
      );
      dispatch(setPost({ post: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WidgetWrapper m='2rem 0'>
      <Friend
        friendId={post.user.id}
        name={`${post.user.firstName} ${post.user.lastName}`}
        subtitle={post.user.location}
        userPicturePath={post.user.picturePath}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {post.description}
      </Typography>
      {post.picturePath && (
        <img
          src={`http://localhost:8800${post.picturePath}`}
          width='100%'
          height='auto'
          alt='post'
          style={{ borderRadius: '0.75re,', marginTop: '0.75rem' }}
        />
      )}
      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>
          <FlexBetween gap='0.3rem'>
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap='0.3rem'>
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{post.comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt='0.5rem'>
          {post.comments.map((c) => (
            <Box key={c.id}>
              <Divider />
              <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>
                {c.description}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
