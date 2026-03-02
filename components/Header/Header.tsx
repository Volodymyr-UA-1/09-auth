import Link from 'next/link';

import css from '@/components/Header/Header.module.css';
import { AuthNavigation } from '../AuthNavigation/AuthNavigation';


interface HeaderProps {
    menuItems?: { title: string; href: string }[];
}

const Header = ({
    menuItems = [
        { title: 'Home', href: '/' },
        { title: 'Notes', href: '/notes/filter/all' }, 
    ],
}: HeaderProps) => {
    return (
        <header className={css.header}>
            <Link href="/" aria-label="Home" className={css.logo}>
                NoteHub
            </Link>

            <nav>
                <ul className={css.navigation}>
                    {/* Рендеримо базові пункти меню */}
                    {menuItems.map((item) => (
                        <li key={item.href} className={css.navigationItem}>
                            <Link href={item.href} className={css.navigationLink}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                    
                    {/* Додаємо динамічну частину (Profile/Logout або Login/Register) */}
                    <AuthNavigation />
                </ul>
            </nav>
        </header>
    );
};

export default Header;