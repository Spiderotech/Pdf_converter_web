import { Navigate, useParams } from 'react-router-dom';
import { getBlogPostByFileSlug } from '../data/blogPosts';

const FileGuideRedirect = () => {
  const { fileSlug = '' } = useParams();
  const post = getBlogPostByFileSlug(fileSlug);

  return <Navigate to={post ? `/blog/${post.slug}` : '/blog'} replace />;
};

export default FileGuideRedirect;
