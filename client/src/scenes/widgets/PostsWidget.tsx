import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state';
import PostWidget from './PostWidget';
import axios from 'axios';

interface Like {
  id: string;
  postId: string;
  userId: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  description: string;
  updatedAt: string;
  createdAt: string;
}

export interface Post {
  id: string;
  description: string;
  picturePath: string;
  updatedAt: string;
  createdAt: string;
  user: {
    id: string;
    picturePath: string;
    firstName: string;
    lastName: string;
    location: string;
  };
  likes: Like[];
  comments: Comment[];
}

const PostsWidget = ({
  userId,
  isProfile = false,
}: {
  userId: string;
  isProfile?: boolean;
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const getPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8800/api/posts', {
        withCredentials: true,
      });
      dispatch(setPosts({ posts: res.data }));
    } catch (error) {
      console.log(error);
    }
  };
  const getUserPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/posts/${userId}/posts`,
        {
          withCredentials: true,
        }
      );
      dispatch(setPosts({ posts: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isProfile ? getUserPosts() : getPosts();
  }, []);

  return (
    <>
      {posts.map((post: Post) => (
        <PostWidget key={post.id} post={post} />
      ))}
    </>
  );
};

export default PostsWidget;
