import styles from '@/components/overlay/index.module.css'

export default function Loading({ backgroundColor, children }: { backgroundColor?: string, children?: React.ReactNode }) { 
  const style = backgroundColor ? { backgroundColor } : {};
  
  return (
    <div className={`${styles.overlay}`} style={style}>
      <span className={styles.alert}>Loading...</span>
      {children}
    </div>
  );
}
