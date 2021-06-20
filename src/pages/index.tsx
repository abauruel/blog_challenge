
import { useState } from 'react';
import Header from '../components/Header';
import PostItem from '../components/PostItem';
import Prismic from '@prismicio/client'

import Link from 'next/link'
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  // TODO
  const { next_page, results } = postsPagination
  const [posts, setPosts] = useState<Post[]>(results)
  const [nextPage, setNextPage] = useState(next_page)

  async function handleNextPage() {
    fetch(next_page)
      .then(response => response.json())
      .then(response => {

        const newPosts = posts.concat(response.results)
        setPosts(newPosts)
        setNextPage(response.next_page)
      })
  }
  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.posts}>

        {posts?.map(p => (
          <PostItem postItem={p} key={p.uid} />
        ))}

      </div>
      {nextPage &&
        <span onClick={handleNextPage}>Carregar mais posts</span>
      }
    </div>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 10
  });

  const response = postsResponse.results as Post[]

  const results = response.map(r => {
    const result = {
      uid: r.uid,
      first_publication_date: r.first_publication_date,
      data: r.data
    }
    return result
  })
  const next_page = postsResponse.next_page
  const postsPagination = {
    results, next_page
  }
  return {
    props: {
      postsPagination
    }
  }
};
