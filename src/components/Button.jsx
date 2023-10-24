import styles from './Button.module.css';
export function Button({children, type, onClick}) {
    return (
        <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
            {children}
        </button>
    );
};