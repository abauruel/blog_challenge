import styles from './header.module.scss'
import Link from 'next/link'
export default function Header() {
  // TODO
  return (
    <div className={styles.logo}>
      <Link href="/" passHref>
        <a>
          <img src='/assets/images/logo.svg' alt="logo" />
        </a>
      </Link>
    </div >
  )
}
