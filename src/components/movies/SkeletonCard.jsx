import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.poster}></div>
      <div className={styles.content}>
        <div className={styles.line}></div>
        <div className={styles.lineMedium}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
