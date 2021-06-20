
import Link from 'next/link'
import styles from './postlist.module.scss'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'


interface PostItemProps {
  postItem: {
    uid?: string,
    first_publication_date: string | null,
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  }
}

export default function PostItem({ postItem }: PostItemProps) {
  const date = format(
    new Date(postItem.first_publication_date), "dd MMM yyyy", {
    locale: ptBR
  })

  return (
    <div className={styles.post}>
      <Link href={`/post/${postItem.uid}`} passHref>
        <a>
          {postItem.data.title}
        </a>
      </Link>
      <p>
        {postItem.data.subtitle}
      </p>
      <div className={styles.info}>
        <div className={styles.dateContainer}>
          <FiCalendar />
          <span>{date}</span>
        </div>
        <div className={styles.authorContainer}>
          <FiUser />
          <span>{postItem.data.author}</span>
        </div>
      </div>
    </div>

  )
}
