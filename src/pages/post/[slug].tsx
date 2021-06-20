import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { RichText } from 'prismic-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { route } from 'next/dist/next-server/server/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

  const [data, setData] = useState("")

  const [readingTime, setReadingTime] = useState(0)

  function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  useEffect(() => {
    if (!isEmpty(post)) {
      setData(format(new Date(post.first_publication_date), 'dd MMM yyyy', {
        locale: ptBR
      }))

    }
  }, [])

  useEffect(() => {

    if (!isEmpty(post)) {
      const times = post?.data?.content?.map(c => {
        const bodyText = RichText?.asText(c.body)
        const word_count = bodyText.split(' ').length + c.heading.split(' ').length
        const avg_words_per_minute = 200
        const estimated_reading_time = Math.ceil(word_count / avg_words_per_minute)
        return estimated_reading_time
      })
      setReadingTime(times.reduce((acc, cur) => acc + cur))
    }
  }, [])



  return (

    <>
      <div className={commonStyles.main}>
        <Header />
      </div>




      <img
        src={post.data.banner.url}
        alt="imagem"
        className={styles.banner} />
      <div className={styles.content}>
        <h1>{post?.data.title}</h1>
        <div className={styles.info}>
          <FiCalendar /><span>{data}</span>
          <FiUser /><span>{post?.data.author}</span>
          <FiClock /><span>{readingTime} min</span>
        </div>
        {post.data.content.map(content => (
          <div key={content.heading}>
            <h1>{content.heading}</h1>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{ __html: RichText.asText(content.body) }}
            >
            </div>
          </div>
        ))}
      </div>


    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
  });
  // TODO
  const paths = posts.results.map(r => {
    return { params: { slug: r.uid } }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps = async (context: GetStaticPropsContext) => {

  const { slug } = context.params

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  const { first_publication_date, data, uid } = response


  const post = {
    first_publication_date,
    data,
    uid,
  }
  // // TODO

  // console.log(JSON.stringify(data.content, null, 2))
  return {
    props: {
      post
    }
  }
};
